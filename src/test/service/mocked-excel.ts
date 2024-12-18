// Services
import { ExcelService, ExcelColumn } from "@/infra/services/excel-service";

export class MockedExcelService implements ExcelService {
  async generateReport<T>(
    data: T[],
    columns: ExcelColumn[],
    sheetName: string = "Relatório"
  ): Promise<Buffer> {
    const mockContent = JSON.stringify({
      sheetName,
      columns,
      data,
    });

    return Buffer.from(mockContent);
  }
}
