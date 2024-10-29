// Libs
import { asFunction, AwilixContainer } from "awilix";

// Use-cases
import { RegisterUseCase } from "@/core/use-cases/register";
import { AuthenticateUseCase } from "@/core/use-cases/authenticate";
import { VerifyUserUsecase } from "@/core/use-cases/verify-user";
import { RegisterFarmUseCase } from "@/core/use-cases/register-farm";
import { OfferProductsUseCase } from "@/core/use-cases/offer-products";
import { UpdateUserUseCase } from "@/core/use-cases/update-user";
import { UpdateOfferUseCase } from "@/core/use-cases/update-offer";
import { OrderProductsUseCase } from "@/core/use-cases/order-products";
import { RequestOtpUseCase } from "@/core/use-cases/request-otp";
import { ListCyclesUseCase } from "@/core/use-cases/list-cycles";
import { ListProductsUsecase } from "@/core/use-cases/list-products";
import { HandleBagUseCase } from "@/core/use-cases/handle-bag";
import { FetchBagUseCase } from "@/core/use-cases/fetch-bag";
import { ListBagsUseCase } from "@/core/use-cases/list-bags";
import { PrintBagsReportUseCase } from "@/core/use-cases/print-bags-report";
import { HandleBoxStatusUseCase } from "@/core/use-cases/handle-box-status";
import { FetchProfileUseCase } from "@/core/use-cases/fetch-profile";
import { ListBoxesUseCase } from "@/core/use-cases/list-boxes";
import { SearchCatalogsUseCase } from "@/core/use-cases/search-catalogs";
import { FetchBoxUseCase } from "@/core/use-cases/fetch-box";
import { FetchCatalogUseCase } from "@/core/use-cases/fetch-catalog";
import { FetchLastCatalogUseCase } from "@/core/use-cases/fetch-last-catalog";
import { FetchCurrentBoxUseCase } from "@/core/use-cases/fetch-current-box";
import { DeleteOfferUseCase } from "@/core/use-cases/delete-offer";
import { ListFarmsUseCase } from "@/core/use-cases/list-farms";
import { HandleFarmStatusUseCase } from "@/core/use-cases/handle-farm-status";
import { FetchCurrentCatalogUseCase } from "@/core/use-cases/fetch-current-catalog";
import { RequestPasswordUpdateUseCase } from "@/core/use-cases/request-password-update";
import { OpenPaymentUseCase } from "@/core/use-cases/open-payment";
import { RegisterPaymentUseCase } from "@/core/use-cases/register-payment";
import { UpdatePaymentUseCase } from "@/core/use-cases/update-payment";

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
      ({ usersRepository, sessionsRepository, hasher }) =>
        new VerifyUserUsecase(usersRepository, sessionsRepository, hasher)
    ),
    handleBoxStatusUseCase: asFunction(
      ({ boxesRepository, ordersRepository }) =>
        new HandleBoxStatusUseCase(boxesRepository, ordersRepository)
    ),
    registerFarmUseCase: asFunction(
      ({ usersRepository, farmsRepository }) =>
        new RegisterFarmUseCase(usersRepository, farmsRepository)
    ),
    offerProductsUseCase: asFunction(
      ({
        farmsRepository,
        productsRepository,
        catalogsRepository,
        offersRepository,
        cyclesRepository,
      }) =>
        new OfferProductsUseCase(
          farmsRepository,
          productsRepository,
          catalogsRepository,
          offersRepository,
          cyclesRepository
        )
    ),
    updateUserUseCase: asFunction(
      ({ usersRepository, encrypter }) =>
        new UpdateUserUseCase(usersRepository, encrypter)
    ),
    updateOfferUseCase: asFunction(
      ({
        farmsRepository,
        offersRepository,
        cyclesRepository,
        catalogsRepository,
      }) =>
        new UpdateOfferUseCase(
          farmsRepository,
          offersRepository,
          cyclesRepository,
          catalogsRepository
        )
    ),
    orderPoductsUseCase: asFunction(
      ({
        usersRepository,
        cyclesRepository,
        offersRepository,
        ordersRepository,
        catalogsRepository,
        bagsRepository,
        boxesRepository,
        addressesRepository,
        otpProvider,
      }) =>
        new OrderProductsUseCase(
          usersRepository,
          cyclesRepository,
          offersRepository,
          ordersRepository,
          catalogsRepository,
          bagsRepository,
          boxesRepository,
          addressesRepository,
          otpProvider
        )
    ),
    fetchProfileUseCase: asFunction(
      ({ usersRepository }) => new FetchProfileUseCase(usersRepository)
    ),
    requestOtpUseCase: asFunction(
      ({ usersRepository, otpProvider, otpsRepository }) =>
        new RequestOtpUseCase(usersRepository, otpProvider, otpsRepository)
    ),
    listBoxesUseCase: asFunction(
      ({ cyclesRepository, boxesRepository }) =>
        new ListBoxesUseCase(cyclesRepository, boxesRepository)
    ),
    listCyclesUseCase: asFunction(
      ({ cyclesRepository }) => new ListCyclesUseCase(cyclesRepository)
    ),
    searchCatalogsUseCase: asFunction(
      ({ cyclesRepository, catalogsRepository }) =>
        new SearchCatalogsUseCase(cyclesRepository, catalogsRepository)
    ),
    fetchBoxUseCase: asFunction(
      ({ boxesRepository }) => new FetchBoxUseCase(boxesRepository)
    ),
    fetchCatalogUseCase: asFunction(
      ({ catalogsRepository }) => new FetchCatalogUseCase(catalogsRepository)
    ),
    listProductsUseCase: asFunction(
      ({ productsRepository }) => new ListProductsUsecase(productsRepository)
    ),
    printBagsReport: asFunction(
      ({ cyclesRepository, bagsRepository, pdfService }) =>
        new PrintBagsReportUseCase(cyclesRepository, bagsRepository, pdfService)
    ),
    handleBagUseCase: asFunction(
      ({ bagsRepository }) => new HandleBagUseCase(bagsRepository)
    ),
    fetchBagUseCase: asFunction(
      ({ bagsRepository }) => new FetchBagUseCase(bagsRepository)
    ),
    listBagsUseCase: asFunction(
      ({ cyclesRepository, bagsRepository }) =>
        new ListBagsUseCase(cyclesRepository, bagsRepository)
    ),
    fetchLastCatalogUseCase: asFunction(
      ({ cyclesRepository, farmsRepository, catalogsRepository }) =>
        new FetchLastCatalogUseCase(
          cyclesRepository,
          farmsRepository,
          catalogsRepository
        )
    ),
    deleteOfferUseCase: asFunction(
      ({ farmsRepository, offersRepository, catalogsRepository }) =>
        new DeleteOfferUseCase(
          farmsRepository,
          offersRepository,
          catalogsRepository
        )
    ),
    listFarmsUseCase: asFunction(
      ({ farmsRepository }) => new ListFarmsUseCase(farmsRepository)
    ),
    handleFarmStatusUseCase: asFunction(
      ({ farmsRepository }) => new HandleFarmStatusUseCase(farmsRepository)
    ),
    fetchCurrentBoxUseCase: asFunction(
      ({ boxesRepository, cyclesRepository }) =>
        new FetchCurrentBoxUseCase(boxesRepository, cyclesRepository)
    ),
    fetchCurrentCatalogUseCase: asFunction(
      ({ cyclesRepository, farmsRepository, catalogsRepository }) =>
        new FetchCurrentCatalogUseCase(
          cyclesRepository,
          farmsRepository,
          catalogsRepository
        )
    ),
    requestPasswordUpdateUseCase: asFunction(
      ({ usersRepository }) => new RequestPasswordUpdateUseCase(usersRepository)
    ),
    openPaymentUseCase: asFunction(
      ({ bagsRepository, paymentsRepository, pixProvider }) =>
        new OpenPaymentUseCase(bagsRepository, paymentsRepository, pixProvider)
    ),
    registerPaymentUseCase: asFunction(
      ({ bagsRepository, paymentsRepository }) =>
        new RegisterPaymentUseCase(bagsRepository, paymentsRepository)
    ),
    updatePaymentUseCase: asFunction(
      ({ paymentsRepository }) => new UpdatePaymentUseCase(paymentsRepository)
    ),
  });
};
