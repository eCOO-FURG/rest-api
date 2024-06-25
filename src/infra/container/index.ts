import { RegisterUseCase } from "@/core/use-cases/register";
import { MockedEncrypter } from "@/test/cryptography/mocked-encrypter";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { asClass, asFunction, createContainer } from "awilix";

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
