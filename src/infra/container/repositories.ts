// Libraries
import { asClass, AwilixContainer } from "awilix";

// Repositories
import { PrismaAddressesRepository } from "@/infra/database/repositories/prisma-addresses-repository";
import { PrismaBagsRepository } from "@/infra/database/repositories/prisma-bags-repository";
import { PrismaBoxesRepository } from "@/infra/database/repositories/prisma-boxes-repository";
import { PrismaCatalogsRepository } from "@/infra/database/repositories/prisma-catalogs-repository";
import { PrismaCategoriesRepository } from "@/infra/database/repositories/prisma-categories-repository";
import { PrismaCyclesRepository } from "@/infra/database/repositories/prisma-cycles-repository";
import { PrismaFarmsRepository } from "@/infra/database/repositories/prisma-farms-repository";
import { PrismaOffersRepository } from "@/infra/database/repositories/prisma-offers-repository";
import { PrismaOtpsRepository } from "@/infra/database/repositories/prisma-otps-repository";
import { PrismaProductRepository } from "@/infra/database/repositories/prisma-products-repository";
import { PrismaSessionsRepository } from "@/infra/database/repositories/prisma-sessions-repository";
import { PrismaUsersRepository } from "@/infra/database/repositories/prisma-users-repository";
import { PrismaPaymentsRepository } from "@/infra/database/repositories/prisma-payments-repository";
import { PrismaOrdersRepository } from "@/infra/database/repositories/prisma-orders-repository";

export default (container: AwilixContainer) => {
  container.register({
    usersRepository: asClass(PrismaUsersRepository).singleton(),
    otpsRepository: asClass(PrismaOtpsRepository).singleton(),
    sessionsRepository: asClass(PrismaSessionsRepository).singleton(),
    cyclesRepository: asClass(PrismaCyclesRepository).singleton(),
    productsRepository: asClass(PrismaProductRepository).singleton(),
    offersRepository: asClass(PrismaOffersRepository).singleton(),
    farmsRepository: asClass(PrismaFarmsRepository).singleton(),
    bagsRepository: asClass(PrismaBagsRepository).singleton(),
    catalogsRepository: asClass(PrismaCatalogsRepository).singleton(),
    boxesRepository: asClass(PrismaBoxesRepository).singleton(),
    addressesRepository: asClass(PrismaAddressesRepository).singleton(),
    categoriesRepository: asClass(PrismaCategoriesRepository).singleton(),
    paymentsRepository: asClass(PrismaPaymentsRepository).singleton(),
    ordersRepository: asClass(PrismaOrdersRepository).singleton(),
  });
};
