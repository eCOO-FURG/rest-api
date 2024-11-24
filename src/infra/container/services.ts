// Libs
import { asClass, asFunction, AwilixContainer } from "awilix";
import { createTransport } from "nodemailer";

// Services
import { Nodemailer } from "@/infra/mail/nodemailer";
import { Jwt } from "@/infra/cryptography/jwt";
import { BcrypterHasher } from "@/infra/cryptography/bcrypt";
import { OtpGenerator } from "@/infra/cryptography/otp-generator";
import { PuppeteerPDFService } from "@/infra/pdf/puppeteer";
import { OpenPix } from "@/infra/payment/open-pix";
import { RedisCacheManager } from "@/infra/cache/redis-cache-manager";
import { Cloudinary } from "@/infra/storage/cloudinary";

// Mocks
import { MockedPixProvider } from "@/test/payment/mocked-pix-provider";

// Env
import { env } from "@/infra/env";

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

      if (["production", "staging"].includes(env.ENV)) {
        Object.assign(transporter, {
          auth: {
            user: env.ECOO_EMAIL,
            pass: env.ECOO_EMAIL_PASSWORD,
          },
        });

        const fallback = createTransport({
          host: env.SMTP_FALLBACK_HOST,
          port: env.SMTP_PORT,
          auth: {
            user: env.ECOO_FALLBACK_EMAIL,
            pass: env.ECOO_FALLBACK_EMAIL_PASSWORD,
          },
        });

        return new Nodemailer(transporter, fallback);
      }

      return new Nodemailer(transporter);
    }),
    pdfService: asClass(PuppeteerPDFService).singleton(),
    pixProvider: asFunction(() => {
      if (env.ENV === "staging" || env.ENV === "production")
        return new OpenPix();

      return new MockedPixProvider();
    }),
    cacheManager: asClass(RedisCacheManager).singleton(),
    storage: asClass(Cloudinary).singleton(),
  });
};
