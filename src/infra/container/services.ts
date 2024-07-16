// Libs
import { asClass, asFunction, AwilixContainer } from "awilix";
import { createTransport } from "nodemailer";

// Services
import { Nodemailer } from "@/infra/mail/nodemailer";
import { Jwt } from "@/infra/cryptography/jwt";
import { BcrypterHasher } from "@/infra/cryptography/bcrypt";
import { OtpGenerator } from "@/infra/cryptography/otp-generator";

// Env
import { env } from "@/infra/env";

export default (container: AwilixContainer) => {
  container.register({
    encrypter: asClass(BcrypterHasher).singleton(),
    hasher: asClass(Jwt).singleton(),
    otpProvider: asClass(OtpGenerator),
    mailer: asFunction(() => {
      if (["production", "staging"].includes(env.ENV)) {
        const transporter = createTransport({
          host: env.SMTP_HOST,
          port: env.SMTP_PORT,
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

      const transporter = createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
      });

      return new Nodemailer(transporter);
    }),
  });
};
