// Repositories
import { CatalogsRepository } from "@/core/repositories/catalogs-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";

// Services
import { PDFService } from "@/core/report/pdf-service";
import { SpreadsheetService } from "../report/spreadsheet-service";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Types
type ReportType = "pdf" | "spreadsheet";

interface FetchOffersReportUseCaseRequest {
  type: ReportType;
  cycle_id?: string;
  since?: Date;
  before?: Date;
}

export class FetchOffersReportUseCase {
  constructor(
    private cyclesRepository: CyclesRepository,
    private catalogsRepository: CatalogsRepository,
    private pdfService: PDFService,
    private spreadsheetService: SpreadsheetService,
  ) {}

  async execute({ type, cycle_id, since, before }: FetchOffersReportUseCaseRequest) {
    if (cycle_id) {
      const cycle = await this.cyclesRepository.find("cycle", {
        id: cycle_id,
      });

      if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);
    }

    const catalogs = await this.catalogsRepository.list("catalog-and-offers", {
      cycle: cycle_id ? { id: cycle_id } : undefined,
      since,
      before,
    });

    switch (type) {
      case "pdf":
        return {
          file: await this.pdfService.generate({
            type: "offers-report",
            props: { catalogs },
          }),
        };
      case "spreadsheet":
        return {
          file: await this.spreadsheetService.generate({
            type: "offers-report",
            props: { catalogs, since, before },
          }),
        };

      default:
        throw new Error("Unsupported report type.");
    }
  }
}
