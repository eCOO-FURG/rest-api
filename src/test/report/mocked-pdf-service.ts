// Services
import {
  PDFService,
  PDFServiceGenerateRequest,
  PDFReportType,
} from "@/core/report/pdf-service";

export class MockedPDFService implements PDFService {
  async generate<T extends PDFReportType>(
    request: PDFServiceGenerateRequest<T>
  ): Promise<Buffer> {
    const content = JSON.stringify(request);
    return Buffer.from(content);
  }
}
