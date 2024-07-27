import puppeteer, { Browser } from "puppeteer";

import { PDFService } from "@/core/pdf/pdf-service";

export class PuppeteerPDFService implements PDFService {
  private browser: Browser | null = null;

  async init() {
    if (this.browser) return;

    this.browser = await puppeteer.launch({
      executablePath:
        process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }

  async generateFromHTML(html: string): Promise<Buffer> {
    if (!this.browser) throw new Error("Couldn't find browser");

    const page = await this.browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.evaluateHandle("document.fonts.ready");

    const pdfBuffer = await page.pdf({
      format: "a4",
      printBackground: true,
    });

    await page.close();
    return pdfBuffer;
  }
}
