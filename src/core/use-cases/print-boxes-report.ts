// Repositories
import { BoxesRepository } from "@/core/repositories/boxes-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";

// Services
import { PDFService } from "@/core/report/pdf-service";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Mappers
import { BoxReportMapper } from "@/core/mappers/box-report-mapper";

interface PrintBoxesReportUseCaseRequest {
  cycle_id: string;
}

export class PrintBoxesReportUseCase {
  constructor(
    private cyclesRepository: CyclesRepository,
    private boxesRepository: BoxesRepository,
    private pdfService: PDFService
  ) {}

  async execute({ cycle_id }: PrintBoxesReportUseCaseRequest) {
    const cycle = await this.cyclesRepository.find("basic", { id: cycle_id });

    if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    const boxes = await this.boxesRepository.list("merge", {
      catalog: { cycle: { id: cycle_id } },
    });

    const formattedBoxes = BoxReportMapper.formatBoxes(boxes);

    const pdf = await this.pdfService.generate({
      type: "boxes-report",
      props: { boxes: formattedBoxes },
    });

    return { pdf };
  }
}
