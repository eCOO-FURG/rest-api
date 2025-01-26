// Services
import {
  SpreadsheetService,
  SpreadsheetServiceGenerateRequest,
} from "@/core/report/spreadsheet-service";

export class MockedSpreadsheetService implements SpreadsheetService {
  async generate({ type, props }: SpreadsheetServiceGenerateRequest) {
    return Buffer.from(JSON.stringify({ type, props }));
  }
}
