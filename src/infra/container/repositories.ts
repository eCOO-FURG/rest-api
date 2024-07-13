import { asClass, AwilixContainer } from "awilix";

import { PrismaCyclesRepository } from "../database/repositories/prisma-cycles-repository";
import { PrismaFarmsRepository } from "../database/repositories/prisma-farms-repository";
import { PrismaOffersRepository } from "../database/repositories/prisma-offers-repository";
import { PrismaOrdersRepository } from "../database/repositories/prisma-orders-repository";
import { PrismaOtpsRepository } from "../database/repositories/prisma-otps-repository";
import { PrismaProductRepository } from "../database/repositories/prisma-products-repository";
import { PrismaSessionsRepository } from "../database/repositories/prisma-sessions-repository";
import { PrismaUsersRepository } from "../database/repositories/prisma-users-repository";

export default (container: AwilixContainer) => {
  container.register({
    usersRepository: asClass(PrismaUsersRepository).singleton(),
    otpsRepository: asClass(PrismaOtpsRepository).singleton(),
    sessionsRepository: asClass(PrismaSessionsRepository).singleton(),
    cyclesRepository: asClass(PrismaCyclesRepository).singleton(),
    productsRepository: asClass(PrismaProductRepository).singleton(),
    offersRepository: asClass(PrismaOffersRepository).singleton(),
    ordersRepository: asClass(PrismaOrdersRepository).singleton(),
    farmsRepository: asClass(PrismaFarmsRepository).singleton(),
  });
};
