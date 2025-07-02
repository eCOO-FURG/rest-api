// Services
import { SpreadsheetColumn, SpreadsheetService, SpreadsheetServiceGenerateRequest } from "@/core/report/spreadsheet-service";

// Views
import { PRODUCTS_SALES_VIEW } from "@/infra/report/spreadsheet/views/products-sales";
import { BAGS_SALES_VIEW } from "@/infra/report/spreadsheet/views/bags-sales";
import { FARMS_PRODUCERS_VIEW } from "@/infra/report/spreadsheet/views/farms-sales";
import { OFFERS_REPORT_VIEW } from "@/infra/report/spreadsheet/views/offers-report";

// Libraries
import { Workbook } from "exceljs";

// Types
import { File } from "@/core/types/file";

const names: Record<SpreadsheetServiceGenerateRequest["type"], string> = {
  "sales-report": "Relatorio de vendas",
  "offers-report": "Relatorio de ofertas",
};

export type SpreadsheetView = (props: SpreadsheetServiceGenerateRequest["props"]) => Promise<{
  columns: SpreadsheetColumn[];
  rows: Record<string, unknown>[];
  name: string;
}>;

export const SPREADSHEETS: Record<SpreadsheetServiceGenerateRequest["type"], SpreadsheetView[]> = {
  "sales-report": [PRODUCTS_SALES_VIEW, BAGS_SALES_VIEW, FARMS_PRODUCERS_VIEW],
  "offers-report": [OFFERS_REPORT_VIEW],
};

export class ExcelService implements SpreadsheetService {
  async generate({ type, props }: SpreadsheetServiceGenerateRequest): Promise<File> {
    const workbook = new Workbook();

    const views = SPREADSHEETS[type];

    for (const view of views) {
      const { columns, rows, name } = await view(props);

      const worksheet = workbook.addWorksheet(name);

      worksheet.columns = columns;

      for (const row of rows) {
        worksheet.addRow(row);
      }
    }

    const buffer = await workbook.xlsx.writeBuffer();

    return {
      name: `${names[type]}.xlsx`,
      mimetype: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      size: buffer.byteLength,
      content: Buffer.from(buffer),
    };
  }
}
