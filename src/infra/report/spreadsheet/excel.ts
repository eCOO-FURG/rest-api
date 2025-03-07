// Services
import {
  SpreadsheetColumn,
  SpreadsheetService,
  SpreadsheetServiceGenerateRequest,
} from "@/core/report/spreadsheet-service";

// Views
import { SALES_CONSUMERS_VIEW } from "@/infra/report/spreadsheet/views/sales-consumers";
import { SALES_PRODUCERS_VIEW } from "@/infra/report/spreadsheet/views/sales-producers";
import { SALES_PRODUCTS_VIEW } from "@/infra/report/spreadsheet/views/sales-products";

// Libraries
import { Workbook } from "exceljs";

// Types
import { File } from "@/core/types/file";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

export const SPREADSHEETS: Record<
  SpreadsheetServiceGenerateRequest["type"],
  (props: SpreadsheetServiceGenerateRequest["props"]) => Promise<
    {
      columns: SpreadsheetColumn[];
      rows: Record<string, unknown>[];
    }[]
  >
> = {
  "sales-report": [
    SALES_PRODUCTS_VIEW,
    SALES_PRODUCERS_VIEW,
    SALES_CONSUMERS_VIEW,
  ] as any,
  "sales-products": [SALES_PRODUCTS_VIEW] as any,
  "sales-producers": [SALES_PRODUCERS_VIEW] as any,
  "sales-consumers": [SALES_CONSUMERS_VIEW] as any,
};

export class ExcelService implements SpreadsheetService {
  async generate({
    type,
    props,
  }: SpreadsheetServiceGenerateRequest): Promise<File> {
    const workbook = await this.generateWorkbook(type, props);

    const buffer = await workbook.xlsx.writeBuffer();

    return {
      name: `${type}.xlsx`,
      mimetype:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      size: buffer.byteLength,
      content: Buffer.from(buffer),
    };
  }

  private async generateWorkbook(
    type: SpreadsheetServiceGenerateRequest["type"],
    props: SpreadsheetServiceGenerateRequest["props"]
  ) {
    const workbook = new Workbook();

    const views = SPREADSHEETS[type];

    if (!views) throw new ResourceNotFoundError("Spreadsheet view", type);

    if (!Array.isArray(views))
      throw new TypeError("Spreadsheet view must be an array");

    for (const view of views) {
      const { columns, rows, type } = await view(props);

      const worksheet = workbook.addWorksheet(type);

      worksheet.columns = columns;

      for (const row of rows) {
        worksheet.addRow(row);
      }
    }

    return workbook;
  }
}
