// Repositories
import { BoxesRepository } from "@/core/repositories/boxes-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";

// Services
import { PDFService } from "@/core/report/pdf-service";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface FetchInboundReportUseCaseRequest {
  since?: Date;
  before?: Date;
  cycle_id?: string;
}

export class FetchInboundReportUseCase {
  constructor(
    private boxesRepository: BoxesRepository,
    private cyclesRepository: CyclesRepository,
    private pdfService: PDFService,
  ) {}

  async execute({ since, before, cycle_id }: FetchInboundReportUseCaseRequest) {
    if (cycle_id) {
      const cycle = await this.cyclesRepository.find("cycle", {
        id: cycle_id,
      });

      if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);
    }

    const boxes = await this.boxesRepository.list("box-and-orders", {
      since,
      before,
      catalog: { cycle: { id: cycle_id } },
    });

    const pdf = await this.pdfService.generate({
      type: "inbound-report",
      props: { boxes },
    });

    return { file: pdf };
  }
}
