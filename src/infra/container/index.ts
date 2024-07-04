// Libs
import { asClass, asFunction, createContainer } from "awilix";
import { createTransport } from "nodemailer";

// Repositories
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Services
import { MockedEncrypter } from "@/test/cryptography/mocked-encrypter";
import { Nodemailer } from "../mail/nodemailer";
import { Jwt } from "../cryptography/jwt";

// Use-cases
import { RegisterUseCase } from "@/core/use-cases/register";
import { OnRegisteredEvent } from "@/core/events/on-registered";
import { AuthenticateUseCase } from "@/core/use-cases/authenticate";
import { InMemoryOtpsRepository } from "@/test/repositories/in-memory-otps-repository";
import { InMemorySessionsRepository } from "@/test/repositories/in-memory-sessions-repository";
import { VerifyUserUsecase } from "@/core/use-cases/verify-user";

const container = createContainer();

container.register({
  // repositories
  usersRepository: asClass(InMemoryUsersRepository).singleton(),
  otpsRepository: asClass(InMemoryOtpsRepository).singleton(),
  sessionsRepository: asClass(InMemorySessionsRepository).singleton(),
  // services
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
  // events
  onRegisteredEvent: asFunction(
    ({ mailer, hasher }) => new OnRegisteredEvent(mailer, hasher)
  ),
  // use-cases
  registerUsecase: asFunction(
    ({ usersRepository, encrypter }) =>
      new RegisterUseCase(usersRepository, encrypter)
  ),
  authenticateUseCase: asFunction(
    ({
      usersRepository,
      otpsRepository,
      sessionsRepository,
      encrypter,
      hasher,
    }) =>
      new AuthenticateUseCase(
        usersRepository,
        otpsRepository,
        sessionsRepository,
        encrypter,
        hasher
      )
  ),
  verifyUserUseCase: asFunction(
    ({ usersRepository, hasher }) =>
      new VerifyUserUsecase(usersRepository, hasher)
  ),
});

export default container;
