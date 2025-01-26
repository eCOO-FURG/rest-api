// Services
import {
  SpreadsheetColumn,
  SpreadsheetService,
  SpreadsheetServiceGenerateRequest,
} from "@/core/report/spreadsheet-service";

// Views
import { BAGS_REPORT_VIEW } from "@/infra/report/spreadsheet/views/bags-report";

// Libs
import { Workbook } from "exceljs";

export const SPREADSHEETS: Record<
  SpreadsheetServiceGenerateRequest["type"],
  (props: SpreadsheetServiceGenerateRequest["props"]) => Promise<{
    columns: SpreadsheetColumn[];
    rows: Record<string, unknown>[];
  }>
> = {
  "bags-report": BAGS_REPORT_VIEW,
};

export class ExcelService implements SpreadsheetService {
  async generate({
    type,
    props,
  }: SpreadsheetServiceGenerateRequest): Promise<Buffer> {
    const { columns, rows } = await SPREADSHEETS[type]({ ...props });

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(type);

    worksheet.columns = columns;

    for (const row of rows) {
      worksheet.addRow(row);
    }

    const uint8Array = await workbook.xlsx.writeBuffer();

    return Buffer.from(uint8Array);
  }
}
