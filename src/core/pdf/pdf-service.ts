export interface PDFService {
  init: () => Promise<void>;
  generateFromHTML(html: string): Promise<Buffer>;
}
