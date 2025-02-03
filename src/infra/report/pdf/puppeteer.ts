// Libraries
import { Browser, launch, PuppeteerLaunchOptions } from "puppeteer";
import { renderFile } from "ejs";

// Services
import {
  PDFService,
  PDFServiceGenerateRequest,
} from "@/core/report/pdf-service";

// Types
import { File } from "@/core/types/file";

export class Puppeteer implements PDFService {
  private browser: Browser | null = null;

  private config: PuppeteerLaunchOptions = {
    headless: true,
    executablePath: "/usr/bin/chromium",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--no-first-run",
      "--disable-gpu",
    ],
  };

  async init() {
    this.browser = await launch(this.config);
  }

  async generate({ type, props }: PDFServiceGenerateRequest): Promise<File> {
    if (!this.browser) this.browser = await launch(this.config);

    const page = await this.browser.newPage();

    const html = await renderFile(__dirname + `/views/${type}.ejs`, { props });

    await page.setContent(html, { waitUntil: "domcontentloaded" });

    const pdf = await page.pdf({
      format: "a4",
      printBackground: true,
    });

    await page.close();

    return {
      name: `${type}.pdf`,
      mimetype: "application/pdf",
      size: pdf.length,
      content: pdf,
    };
  }
}
