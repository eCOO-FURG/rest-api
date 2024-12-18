import ExcelJS from "exceljs";

export interface ExcelColumn {
  header: string;
  key: string;
  width?: number;
}

export class ExcelService {
  async generateReport<T>(
    data: T[],
    columns: ExcelColumn[],
    sheetName: string = "Relatório"
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    worksheet.columns = columns.map(column => ({
      header: column.header,
      key: column.key,
      width: column.width || 15,
    }));

    data.forEach(item => worksheet.addRow(item));

    const uint8Array = await workbook.xlsx.writeBuffer();

    return Buffer.from(uint8Array);
  }
}