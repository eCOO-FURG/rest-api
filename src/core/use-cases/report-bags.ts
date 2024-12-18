// Repositories
import { BagsRepository } from "@/core/repositories/bags-repository";

// Services
import { ExcelService, ExcelColumn } from "@/infra/services/excel-service";

// Mappers
import { BagReportMapper } from "@/core/mappers/bag-report-mapper";

interface ReportBagsUseCaseRequest {
  since?: Date;
  before?: Date;
}

export class ReportBagsUseCase {
  constructor(
    private bagsRepository: BagsRepository,
    private excelService: ExcelService
  ) {}

  async execute({ since, before }: ReportBagsUseCaseRequest): Promise<Buffer> {
    const bags = await this.bagsRepository.list("merge", { since, before });

    const columns: ExcelColumn[] = [
      { header: "SACOLA", key: "sacola", width: 10 },
      { header: "CONSUMIDOR", key: "consumidor", width: 20 },
      { header: "PREÇO", key: "preco", width: 15 },
      { header: "PRODUTO", key: "produto", width: 20 },
      { header: "PRODUTOR", key: "produtor", width: 25 },
      { header: "QUANTIDADE", key: "quantidade", width: 15 },
      { header: "VALOR DA OFERTA", key: "valorOferta", width: 20 },
      { header: "DATA", key: "data", width: 25 },
      { header: "PAGAMENTO", key: "pagamento", width: 15 },
      { header: "BANDEIRA", key: "bandeira", width: 15 },
      { header: "ENTREGA", key: "entrega", width: 15 },
    ];

    const data = BagReportMapper.toExcelData(bags);

    return this.excelService.generateReport(data, columns, "Relatório de Sacolas");
  }
}
