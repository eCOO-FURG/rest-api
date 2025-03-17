// Libraries
import { asClass, asFunction, AwilixContainer } from "awilix";
import { createTransport } from "nodemailer";

// Services
import { Nodemailer } from "@/infra/mail/nodemailer";
import { Jwt } from "@/infra/cryptography/jwt";
import { BcrypterHasher } from "@/infra/cryptography/bcrypt";
import { OtpGenerator } from "@/infra/cryptography/otp-generator";
import { Puppeteer } from "@/infra/report/pdf/puppeteer";
import { OpenPix } from "@/infra/payment/open-pix";
import { RedisCacheManager } from "@/infra/cache/redis-cache-manager";
import { Cloudinary } from "@/infra/storage/cloudinary";
import { ExcelService } from "@/infra/report/spreadsheet/excel";
import { Telegram } from "@/infra/message/telegram";

// Mocks
import { MockedPixProvider } from "@/test/payment/mocked-pix-provider";
import { MockedStorage } from "@/test/storage/mocked-storage";

// Env
import { env } from "@/infra/env";

const deploy =
  env.ENVIRONMENT === "PRODUCTION" || env.ENVIRONMENT === "STAGING";

export default (container: AwilixContainer) => {
  container.register({
    encrypter: asClass(BcrypterHasher).singleton(),
    hasher: asClass(Jwt).singleton(),
    otpProvider: asClass(OtpGenerator).singleton(),
    mailer: asFunction(() => {
      const transporter = createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
      });

      if (deploy) {
        Object.assign(transporter, {
          auth: {
            user: env.EMAIL_ACCOUNT,
            pass: env.EMAIL_PASSWORD,
          },
        });

        const fallback = createTransport({
          host: env.FALLBACK_SMTP_HOST,
          port: env.SMTP_PORT,
          auth: {
            user: env.FALLBACK_EMAIL_ACCOUNT,
            pass: env.FALLBACK_EMAIL_PASSWORD,
          },
        });

        return new Nodemailer(transporter, fallback);
      }

      return new Nodemailer(transporter);
    }),
    pdfService: asClass(Puppeteer).singleton(),
    pixProvider: asFunction(() => {
      if (deploy) return new OpenPix();
      return new MockedPixProvider();
    }),
    cacheManager: asClass(RedisCacheManager).singleton(),
    storage: asFunction(() => {
      if (deploy) return new Cloudinary();
      return new MockedStorage();
    }).singleton(),
    spreadsheetService: asClass(ExcelService).singleton(),
    chat: asClass(Telegram).singleton(),
  });

  container.resolve("chat");
};
