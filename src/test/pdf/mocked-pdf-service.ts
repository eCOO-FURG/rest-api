// Services
import { PDFService, PDFServiceGenerateRequest } from "@/core/pdf/pdf-service";

export class MockedPDFService implements PDFService {
  async generate({ type, props }: PDFServiceGenerateRequest): Promise<Buffer> {
    const content = JSON.stringify({ type, props });
    return Buffer.from(content);
  }
}
