import { asClass, asFunction, AwilixContainer } from "awilix";
import { createTransport } from "nodemailer";
import { MockedEncrypter } from "@/test/cryptography/mocked-encrypter";
import { Nodemailer } from "@/infra/mail/nodemailer";
import { Jwt } from "@/infra/cryptography/jwt";

export default (container: AwilixContainer) => {
  container.register({
    encrypter: asClass(MockedEncrypter).singleton(),
    mailer: asFunction(() => {
      const options = {
        host: "localhost",
        port: 2525,
      };

      const transporter = createTransport(options);

      return new Nodemailer(transporter);
    }),
    hasher: asClass(Jwt).singleton(),
  });
};
