// Services
import { PDFService, PDFServiceGenerateRequest } from "@/core/report/pdf-service";

// Types
import { File } from "@/core/types/file";

export class MockedPDFService implements PDFService {
  async generate({ type, props }: PDFServiceGenerateRequest): Promise<File> {
    const content = JSON.stringify({ type, props });

    return {
      name: `${type}.pdf`,
      mimetype: "application/pdf",
      size: content.length,
      content: Buffer.from(content),
    };
  }
}
