// Repositories
import { BagsRepository } from "@/core/repositories/bags-repository";

// Services
import { SpreadsheetService } from "@/core/report/spreadsheet-service";

interface ReportBagsUseCaseRequest {
  since?: Date;
  before?: Date;
}

export class ReportBagsUseCase {
  constructor(
    private bagsRepository: BagsRepository,
    private spreadsheetService: SpreadsheetService
  ) {}

  async execute({ since, before }: ReportBagsUseCaseRequest) {
    const bags = await this.bagsRepository.list("merge", { since, before });

    const spreadsheet = this.spreadsheetService.generate({
      type: "bags-report",
      props: { bags },
    });

    return spreadsheet;
  }
}
