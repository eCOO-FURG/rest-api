import { asFunction, AwilixContainer } from "awilix";
import { RegisterUseCase } from "@/core/use-cases/register";
import { AuthenticateUseCase } from "@/core/use-cases/authenticate";
import { VerifyUserUsecase } from "@/core/use-cases/verify-user";
import { RegisterFarmUseCase } from "@/core/use-cases/register-farm";
import { OfferProductsUseCase } from "@/core/use-cases/offer-products";

export default (container: AwilixContainer) => {
  container.register({
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
};
