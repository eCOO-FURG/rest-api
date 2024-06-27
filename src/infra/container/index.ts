// Libs
import { asClass, asFunction, createContainer } from "awilix";

// Repositories
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Services
import { MockedEncrypter } from "@/test/cryptography/mocked-encrypter";

// Use-cases
import { RegisterUseCase } from "@/core/use-cases/register";
import { OnRegisteredEvent } from "@/core/events/on-registered";
import { MockedMailer } from "@/test/mail/mocked-mailer";

const container = createContainer();

container.register({
  // repositories
  usersRepository: asClass(InMemoryUsersRepository).singleton(),
  // services
  encrypter: asClass(MockedEncrypter).singleton(),
  mailer: asClass(MockedMailer),
  // use-cases
  registerUsecase: asFunction(
    ({ usersRepository, encrypter }) =>
      new RegisterUseCase(usersRepository, encrypter)
  ),
  // events
  onRegisteredEvent: asFunction(({ mailer }) => new OnRegisteredEvent(mailer)),
});

export default container;
