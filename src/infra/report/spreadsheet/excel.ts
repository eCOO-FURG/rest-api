// Services
import {
  SpreadsheetColumn,
  SpreadsheetService,
  SpreadsheetServiceGenerateRequest,
} from "@/core/report/spreadsheet-service";

// Views
import { SALES_REPORT_VIEW } from "@/infra/report/spreadsheet/views/sales-report";

// Libraries
import { Workbook } from "exceljs";

// Types
import { File } from "@/core/types/file";

export const SPREADSHEETS: Record<
  SpreadsheetServiceGenerateRequest["type"],
  (props: SpreadsheetServiceGenerateRequest["props"]) => Promise<{
    columns: SpreadsheetColumn[];
    rows: Record<string, unknown>[];
  }>
> = {
  "relatorio-de-vendas": SALES_REPORT_VIEW,
};

export class ExcelService implements SpreadsheetService {
  async generate({
    type,
    props,
  }: SpreadsheetServiceGenerateRequest): Promise<File> {
    const { columns, rows } = await SPREADSHEETS[type]({ ...props });

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(type);

    worksheet.columns = columns;

    for (const row of rows) {
      worksheet.addRow(row);
    }

    const buffer = await workbook.xlsx.writeBuffer();

    return {
      name: `${type}.xlsx`,
      mimetype:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      size: buffer.byteLength,
      content: Buffer.from(buffer),
    };
  }
}
