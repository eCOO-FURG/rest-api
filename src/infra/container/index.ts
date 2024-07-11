// Libs
import { asClass, asFunction, createContainer } from "awilix";
import { createTransport } from "nodemailer";

// Repositories
import { PrismaUsersRepository } from "@/infra//database/repositories/prisma-users-repository";
import { PrismaOtpsRepository } from "@/infra//database/repositories/prisma-otps-repository";
import { PrismaSessionsRepository } from "@/infra//database/repositories/prisma-sessions-repository";
import { PrismaCyclesRepository } from "@/infra//database/repositories/prisma-cycles-repository";
import { PrismaProductRepository } from "@/infra//database/repositories/prisma-products-repository";
import { PrismaOffersRepository } from "@/infra//database/repositories/prisma-offers-repository";
import { PrismaOrdersRepository } from "@/infra//database/repositories/prisma-orders-repository";
import { PrismaFarmsRepository } from "../database/repositories/prisma-farms-repository";

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

import { OfferProductsUseCase } from "@/core/use-cases/offer-products";

// Env
import { env } from "@/infra/env";

const container = createContainer();

container.register({
  // repositories
  usersRepository: asClass(PrismaUsersRepository).singleton(),
  otpsRepository: asClass(PrismaOtpsRepository).singleton(),
  sessionsRepository: asClass(PrismaSessionsRepository).singleton(),
  cyclesRepository: asClass(PrismaCyclesRepository).singleton(),
  productsRepository: asClass(PrismaProductRepository).singleton(),
  offersRepository: asClass(PrismaOffersRepository).singleton(),
  ordersRepository: asClass(PrismaOrdersRepository).singleton(),
  farmsRepository: asClass(PrismaFarmsRepository).singleton(),

  // services
  encrypter: asClass(MockedEncrypter).singleton(),
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
});

export default container;
