// Libs
import { Browser, launch, PuppeteerLaunchOptions } from "puppeteer";
import { renderFile } from "ejs";

// Services
import { PDFService, PDFServiceGenerateRequest } from "@/core/pdf/pdf-service";

export class PuppeteerPDFService implements PDFService {
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

  async generate({ type, props }: PDFServiceGenerateRequest): Promise<Buffer> {
    this.browser = await launch(this.config);

    const html = await renderFile(__dirname + `/views/${type}.ejs`, { props });

    const page = await this.browser.newPage();

    await page.setContent(html, { waitUntil: "domcontentloaded" });

    const pdf = await page.pdf({
      format: "a4",
      printBackground: true,
    });

    await this.browser.close();

    return pdf;
  }
}
