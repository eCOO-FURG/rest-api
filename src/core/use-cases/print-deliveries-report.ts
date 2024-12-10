// Repositories
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { BagsRepository } from "@/core/repositories/bags-repository";

// Services
import { PDFService } from "@/core/pdf/pdf-service";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Utils
import { mostPast } from "@/core/utils/most-past";

interface PrintDeliveriesReportUseCaseRequest {
  cycle_id: string;
}

export class PrintDeliveriesReportUseCase {
  constructor(
    private cyclesRepository: CyclesRepository,
    private bagsRepository: BagsRepository,
    private pdfService: PDFService
  ) {}

  async execute({ cycle_id }: PrintDeliveriesReportUseCaseRequest) {
    const cycle = await this.cyclesRepository.find("basic", {
      id: cycle_id,
    });

    if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    const bags = await this.bagsRepository.list("merge", {
      cycle: { id: cycle_id },
      since: mostPast(cycle.order),
    });

    const pdf = await this.pdfService.generate({
      type: "delivery-report",
      props: { bags },
    });

    return { pdf };
  }
}
