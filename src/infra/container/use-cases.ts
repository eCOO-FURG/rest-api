// Libs
import { asFunction, AwilixContainer } from "awilix";

// Use-cases
import { RegisterUseCase } from "@/core/use-cases/register";
import { AuthenticateUseCase } from "@/core/use-cases/authenticate";
import { VerifyUserUsecase } from "@/core/use-cases/verify-user";
import { HandleOrdersDeliveryUseCase } from "@/core/use-cases/handle-orders-delivery";
import { RegisterFarmUseCase } from "@/core/use-cases/register-farm";
import { OfferProductsUseCase } from "@/core/use-cases/offer-products";
import { UpdateUserUseCase } from "@/core/use-cases/update-user";
import { UpdateOfferUseCase } from "@/core/use-cases/update-offer";
import { OrderProductsUseCase } from "@/core/use-cases/order-products";
import { RequestOtpUseCase } from "@/core/use-cases/request-otp";
import { GetProfileUseCase } from "@/core/use-cases/get-profile";
import { ListFarmsWithOrdersUsecase } from "@/core/use-cases/list-farms-with-orders";
import { ListCyclesUseCase } from "@/core/use-cases/list-cycles";
import { SearchOfferingFarmsUseCase } from "@/core/use-cases/search-offering-farms";
import { ListFarmOrdersUseCase } from "@/core/use-cases/list-farm-orders";
import { ListFarmOffersUseCase } from "@/core/use-cases/list-farm-offers";
import { ListProductsUsecase } from "@/core/use-cases/list-products";
import { PrintDeliveriesReportUseCase } from "@/core/use-cases/print-deliveries-report/print-deliveries-report";
import { HandleBagUseCase } from "@/core/use-cases/handle-bag";
import { FetchBagUseCase } from "@/core/use-cases/fetch-bag";
import { ListBagsUseCase } from "@/core/use-cases/list-bags";

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
    updateUserUseCase: asFunction(
      ({ usersRepository, encrypter }) =>
        new UpdateUserUseCase(usersRepository, encrypter)
    ),
    updateOfferUseCase: asFunction(
      ({ farmsRepository, offersRepository }) =>
        new UpdateOfferUseCase(farmsRepository, offersRepository)
    ),
    orderPoductsUseCase: asFunction(
      ({
        usersRepository,
        cyclesRepository,
        offersRepository,
        ordersRepository,
        bagsRepository,
      }) =>
        new OrderProductsUseCase(
          usersRepository,
          cyclesRepository,
          offersRepository,
          ordersRepository,
          bagsRepository
        )
    ),
    getProfileUseCase: asFunction(
      ({ usersRepository }) => new GetProfileUseCase(usersRepository)
    ),
    requestOtpUseCase: asFunction(
      ({ usersRepository, otpProvider, otpsRepository }) =>
        new RequestOtpUseCase(usersRepository, otpProvider, otpsRepository)
    ),
    listFarmsWithOrdersUseCase: asFunction(
      ({ cyclesRepository, farmsRepository }) =>
        new ListFarmsWithOrdersUsecase(cyclesRepository, farmsRepository)
    ),
    listCyclesUseCase: asFunction(
      ({ cyclesRepository }) => new ListCyclesUseCase(cyclesRepository)
    ),
    searchOfferingFarmsUseCase: asFunction(
      ({ cyclesRepository, farmsRepository }) =>
        new SearchOfferingFarmsUseCase(cyclesRepository, farmsRepository)
    ),
    listFarmOrdersUseCase: asFunction(
      ({
        farmsRepository,
        cyclesRepository,
        offersRepository,
        ordersRepository,
      }) =>
        new ListFarmOrdersUseCase(
          farmsRepository,
          cyclesRepository,
          offersRepository,
          ordersRepository
        )
    ),
    listFarmOffersUseCase: asFunction(
      ({ farmsRepository, cyclesRepository, offersRepository }) =>
        new ListFarmOffersUseCase(
          farmsRepository,
          cyclesRepository,
          offersRepository
        )
    ),
    listProductsUseCase: asFunction(
      ({ productsRepository }) => new ListProductsUsecase(productsRepository)
    ),
    printDeliveriesReport: asFunction(
      ({ cyclesRepository, pdfService }) =>
        new PrintDeliveriesReportUseCase(cyclesRepository, pdfService)
    ),
    handleBagUseCase: asFunction(
      ({ bagsRepository }) => new HandleBagUseCase(bagsRepository)
    ),
    fetchBagUseCase: asFunction(
      ({ bagsRepository, ordersRepository }) =>
        new FetchBagUseCase(bagsRepository, ordersRepository)
    ),
    listBagsUseCase: asFunction(
      ({ cyclesRepository, bagsRepository }) =>
        new ListBagsUseCase(cyclesRepository, bagsRepository)
    ),
  });
};
