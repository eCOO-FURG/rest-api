// Libs
import { asFunction, AwilixContainer } from "awilix";

// Use-cases
import { RegisterUseCase } from "@/core/use-cases/register";
import { AuthenticateUseCase } from "@/core/use-cases/authenticate";
import { VerifyUserUsecase } from "@/core/use-cases/verify-user";
import { HandleOrdersDeliveryUseCase } from "@/core/use-cases/handle-orders-delivery";
import { RegisterFarmUseCase } from "@/core/use-cases/register-farm";
import { OfferProductsUseCase } from "@/core/use-cases/offer-products";
import { UpdateOfferUseCase } from "@/core/use-cases/update-offer";
import { OrderProductsUseCase } from "@/core/use-cases/order-products";
import { RequestOtpUseCase } from "@/core/use-cases/request-otp";
import { GetProfileUseCase } from "@/core/use-cases/get-profile";

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
    handleOrdersDeliveryUseCase: asFunction(
      ({ cyclesRepository, farmsRepository, ordersRepository }) =>
        new HandleOrdersDeliveryUseCase(
          cyclesRepository,
          farmsRepository,
          ordersRepository
        )
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
    updateOfferUsecase: asFunction(
      ({
        farmsRepository,
        offersRepository
      }) => new UpdateOfferUseCase(
        farmsRepository, 
        offersRepository
      )
    ),
    orderPoductsUseCase: asFunction(
      ({ usersRepository, offersRepository, ordersRepository }) =>
        new OrderProductsUseCase(
          usersRepository,
          offersRepository,
          ordersRepository
        )
    ),
    getProfileUseCase: asFunction(
      ({ usersRepository }) => new GetProfileUseCase(usersRepository)
    ),
    requestOtpUseCase: asFunction(
      ({ usersRepository, otpProvider, otpsRepository }) =>
        new RequestOtpUseCase(usersRepository, otpProvider, otpsRepository)
    ),
  });
};
