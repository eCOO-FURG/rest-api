// Services
import {
  SpreadsheetService,
  SpreadsheetServiceGenerateRequest,
} from "@/core/report/spreadsheet-service";

// Types
import { File } from "@/core/types/file";

export class MockedSpreadsheetService implements SpreadsheetService {
  async generate({ type, props }: SpreadsheetServiceGenerateRequest): Promise<File> {
    return {
      name: `${type}.xlsx`,
      mimetype: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      size: 0,
      content: Buffer.from(JSON.stringify({ type, props })),
    };
  }
}
