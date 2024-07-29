// Libs
import { asClass, AwilixContainer } from "awilix";

// Repositories
import { PrismaCyclesRepository } from "@/infra/database/repositories/prisma-cycles-repository";
import { PrismaFarmsRepository } from "@/infra/database/repositories/prisma-farms-repository";
import { PrismaOffersRepository } from "@/infra/database/repositories/prisma-offers-repository";
import { PrismaOrdersRepository } from "@/infra/database/repositories/prisma-orders-repository";
import { PrismaOtpsRepository } from "@/infra/database/repositories/prisma-otps-repository";
import { PrismaProductRepository } from "@/infra/database/repositories/prisma-products-repository";
import { PrismaSessionsRepository } from "@/infra/database/repositories/prisma-sessions-repository";
import { PrismaUsersRepository } from "@/infra/database/repositories/prisma-users-repository";
import { PrismaBagsRepository } from "../database/repositories/prisma-bags-repository";

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
    bagsRepository: asClass(PrismaBagsRepository).singleton(),
  });
};
