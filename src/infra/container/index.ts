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
import { AuthenticateUseCase } from "@/core/use-cases/authenticate";
import { InMemoryOtpsRepository } from "@/test/repositories/in-memory-otps-repository";
import { InMemorySessionsRepository } from "@/test/repositories/in-memory-sessions-repository";
import { MockedHasher } from "@/test/cryptography/mocked-hasher";
import { VerifyUserUsecase } from "@/core/use-cases/verify-user";
import { CheckFarmDeliveryUseCase } from "@/core/use-cases/check-farm-delivery";

import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";

const container = createContainer();

container.register({
  // repositories
  usersRepository: asClass(InMemoryUsersRepository).singleton(),
  otpsRepository: asClass(InMemoryOtpsRepository).singleton(),
  sessionsRepository: asClass(InMemorySessionsRepository).singleton(),
  cyclesRepository: asClass(InMemoryCyclesRepository).singleton(),
  farmsRepository: asFunction(
    ({ usersRepository, offersRepository, productsRepository }) =>
      new InMemoryFarmsRepository(
        usersRepository,
        offersRepository,
        productsRepository
      )
  ).singleton(),
  offersRepository: asFunction(
    ({ productsRepository, cyclesRepository }) =>
      new InMemoryOffersRepository(productsRepository, cyclesRepository)
  ).singleton(),
  ordersRepository: asFunction(
    ({ offersRepository }) => new InMemoryOrdersRepository(offersRepository)
  ).singleton(),
  productsRepository: asClass(InMemoryProductsRepository).singleton(),
  // services
  encrypter: asClass(MockedEncrypter).singleton(),
  mailer: asClass(MockedMailer).singleton(),
  hasher: asClass(MockedHasher).singleton(),
  // events
  onRegisteredEvent: asFunction(({ mailer }) => new OnRegisteredEvent(mailer)),
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
  checkFarmDeliveryUseCase: asFunction(
    ({
      cyclesRepository,
      farmsRepository,
      offersRepository,
      ordersRepository,
    }) =>
      new CheckFarmDeliveryUseCase(
        cyclesRepository,
        farmsRepository,
        offersRepository,
        ordersRepository
      )
  ),
});

export default container;
