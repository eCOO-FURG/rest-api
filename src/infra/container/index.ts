// Libs
import { asClass, asFunction, createContainer } from "awilix";
import { createTransport } from "nodemailer";

// Repositories
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { InMemoryOtpsRepository } from "@/test/repositories/in-memory-otps-repository";
import { InMemorySessionsRepository } from "@/test/repositories/in-memory-sessions-repository";

// Services
import { MockedEncrypter } from "@/test/cryptography/mocked-encrypter";
import { Nodemailer } from "../mail/nodemailer";
import { Jwt } from "../cryptography/jwt";

// Events
import { OnRegisteredEvent } from "@/core/events/on-registered";

// Use-cases
import { RegisterUseCase } from "@/core/use-cases/register";
import { AuthenticateUseCase } from "@/core/use-cases/authenticate";
import { VerifyUserUsecase } from "@/core/use-cases/verify-user";
import { RegisterFarmUseCase } from "@/core/use-cases/register-farm";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { OfferProductsUseCase } from "@/core/use-cases/offer-products";
import { UpdateUserUseCase } from "@/core/use-cases/update-user";

const container = createContainer();

container.register({
  // repositories
  usersRepository: asClass(InMemoryUsersRepository).singleton(),
  otpsRepository: asClass(InMemoryOtpsRepository).singleton(),
  sessionsRepository: asClass(InMemorySessionsRepository).singleton(),
  cyclesRepository: asClass(InMemoryCyclesRepository).singleton(),
  productsRepository: asClass(InMemoryProductsRepository).singleton(),
  offersRepository: asFunction(
    ({ productsRepository, cyclesRepository }) =>
      new InMemoryOffersRepository(productsRepository, cyclesRepository)
  ).singleton(),
  ordersRepository: asFunction(
    ({ offersRepository }) => new InMemoryOrdersRepository(offersRepository)
  ).singleton(),
  farmsRepository: asFunction(
    ({
      usersRepository,
      offersRepository,
      productsRepository,
      ordersRepository,
    }) =>
      new InMemoryFarmsRepository(
        usersRepository,
        offersRepository,
        productsRepository,
        ordersRepository
      )
  ).singleton(),

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
  registerFarmUseCase: asFunction(
    ({ usersRepository, farmsRepository }) =>
      new RegisterFarmUseCase(usersRepository, farmsRepository)
  ),
  offerProductsUseCase: asFunction(
    ({
      farmsRepository,
      productsRepository,
      offersRepository,
      cyclesRepository,
    }) =>
      new OfferProductsUseCase(
        farmsRepository,
        productsRepository,
        offersRepository,
        cyclesRepository
      )
  ),
  updateUserUsecase: asFunction(
    ({
      usersRepository,
      encrypter
    }) => new UpdateUserUseCase(usersRepository, encrypter)
  )
});

export default container;
