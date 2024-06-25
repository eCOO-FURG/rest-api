// Libs
import { asClass, asFunction, createContainer } from "awilix";

// Repositories
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Services
import { MockedEncrypter } from "@/test/cryptography/mocked-encrypter";

// Use-cases
import { RegisterUseCase } from "@/core/use-cases/register";

const container = createContainer();

container.register({
  usersRepository: asClass(InMemoryUsersRepository).singleton(),
  encrypter: asClass(MockedEncrypter).singleton(),
  registerUsecase: asFunction(
    ({ usersRepository, encrypter }) =>
      new RegisterUseCase(usersRepository, encrypter)
  ),
});

export default container;
