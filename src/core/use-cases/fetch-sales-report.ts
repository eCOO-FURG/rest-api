// Repositories
import { BagsRepository } from "@/core/repositories/bags-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { FarmsRepository } from "@/core/repositories/farms-repository";

// Services
import { PDFService } from "@/core/report/pdf-service";
import { SpreadsheetService } from "@/core/report/spreadsheet-service";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface FetchSalesReportUseCaseRequest {
  type: "pdf" | "spreadsheet";
  since?: Date;
  before?: Date;
  cycle_id?: string;
  withdraw?: boolean;
}

export class FetchSalesReportUseCase {
  constructor(
    private cyclesRepository: CyclesRepository,
    private farmsRepository: FarmsRepository,
    private bagsRepository: BagsRepository,
    private pdfService: PDFService,
    private spreadsheetService: SpreadsheetService,
  ) {}

  async execute({ cycle_id, type, since, before, withdraw }: FetchSalesReportUseCaseRequest) {
    if (cycle_id) {
      const cycle = await this.cyclesRepository.find("cycle", {
        id: cycle_id,
      });

      if (!cycle) {
        throw new ResourceNotFoundError("Ciclo", cycle_id);
      }
    }

    const bags = await this.bagsRepository.list("bag-and-orders", {
      cycle: { id: cycle_id },
      withdraw,
      since,
      before,
      ...(type === "pdf" && { statuses: ["MOUNTED", "DISPATCHED"] }),
    });

    const catalogs = await this.farmsRepository.list("catalog", {
      offers: { cycle: { id: cycle_id }, period: { since, before } },
    });

    switch (type) {
      case "pdf":
        return {
          file: await this.pdfService.generate({
            type: "sales-report",
            props: { bags, withdraw },
          }),
        };
      case "spreadsheet":
        return {
          file: await this.spreadsheetService.generate({
            type: "sales-report",
            props: { bags, catalogs, since, before },
          }),
        };
    }
  }
}
