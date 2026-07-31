// Libraries
import { asClass, asFunction, AwilixContainer } from "awilix";
import { createTransport } from "nodemailer";

// Services
import { Nodemailer } from "@/infra/mail/nodemailer";
import { Jwt } from "@/infra/cryptography/jwt";
import { BcrypterHasher } from "@/infra/cryptography/bcrypt";
import { Puppeteer } from "@/infra/report/pdf/puppeteer";
import { OpenPix } from "@/infra/payment/open-pix";
import { RedisCacheManager } from "@/infra/cache/redis-cache-manager";
import { Cloudinary } from "@/infra/storage/cloudinary";
import { ExcelService } from "@/infra/report/spreadsheet/excel";
import { Telegram } from "@/infra/message/telegram";
import { BullScheduler } from "@/infra/jobs/bull-scheduler";

// LLM
import { OpenAIProvider } from "@/infra/llm/open-ai-provider";

// Mocks
import { MockedPixProvider } from "@/test/payment/mocked-pix-provider";
import { MockedStorage } from "@/test/storage/mocked-storage";

// Environment
import { env } from "@/infra/env";

const deploy = env.ENVIRONMENT === "PRODUCTION" || env.ENVIRONMENT === "STAGING";

export default (container: AwilixContainer) => {
  container.register({
    encrypter: asClass(BcrypterHasher).singleton(),
    hasher: asClass(Jwt).singleton(),
    mailer: asFunction(() => {
      const providerConfigs = {
        ZOHO:  { host: env.SMTP_HOST,          port: env.SMTP_PORT,       user: env.EMAIL_ACCOUNT,       pass: env.EMAIL_PASSWORD },
        GMAIL: { host: env.FALLBACK_SMTP_HOST,  port: 465,                 user: env.FALLBACK_EMAIL_ACCOUNT, pass: env.FALLBACK_EMAIL_PASSWORD },
        ZEPTO: { host: env.BATCH_SMTP_HOST,     port: env.BATCH_SMTP_PORT, user: env.BATCH_EMAIL_ACCOUNT, pass: env.BATCH_EMAIL_PASSWORD },
      };

      const primary = providerConfigs[env.EMAIL_PROVIDER as keyof typeof providerConfigs];
      const batch   = providerConfigs[env.BATCH_EMAIL_PROVIDER as keyof typeof providerConfigs];

      const transporter = createTransport({
        host: primary.host,
        port: primary.port,
        ...(deploy && { auth: { user: primary.user, pass: primary.pass } }),
      });

      const queue = createTransport({
        host: batch.host,
        port: batch.port,
        ...(deploy && { auth: { user: batch.user, pass: batch.pass } }),
      });

      if (deploy) {
        const fallbackProvider = Object.values(providerConfigs).find(
          (p) => p.host !== primary.host && p.host !== batch.host,
        ) ?? providerConfigs.GMAIL;

        const fallback = createTransport({
          host: fallbackProvider.host,
          port: fallbackProvider.port,
          auth: { user: fallbackProvider.user, pass: fallbackProvider.pass },
        });

        return new Nodemailer(transporter, queue, fallback);
      }

      return new Nodemailer(transporter, queue);
    }),
    pdfService: asClass(Puppeteer).singleton(),
    pixProvider: asFunction(() => {
      if (deploy) {
        return new OpenPix();
      }
      return new MockedPixProvider();
    }),
    cacheManager: asClass(RedisCacheManager).singleton(),
    storage: asFunction(() => {
      if (deploy) {
        return new Cloudinary();
      }
      return new MockedStorage();
    }).singleton(),
    spreadsheetService: asClass(ExcelService).singleton(),
    chat: asClass(Telegram).singleton(),
    llmProvider: asClass(OpenAIProvider).singleton(),
    scheduler: asClass(BullScheduler).singleton(),
  });

  container.resolve("chat");
};
