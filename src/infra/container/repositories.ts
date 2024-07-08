import { asClass, asFunction, AwilixContainer } from "awilix";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { InMemoryOtpsRepository } from "@/test/repositories/in-memory-otps-repository";
import { InMemorySessionsRepository } from "@/test/repositories/in-memory-sessions-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";

export default (container: AwilixContainer) => {
  container.register({
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
  });
};
