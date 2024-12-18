// Libs
import { asFunction, AwilixContainer } from "awilix";

// Use-cases
import { RegisterUseCase } from "@/core/use-cases/register";
import { AuthenticateUseCase } from "@/core/use-cases/authenticate";
import { VerifyUserUsecase } from "@/core/use-cases/verify-user";
import { RegisterFarmUseCase } from "@/core/use-cases/register-farm";
import { UpdateUserUseCase } from "@/core/use-cases/update-user";
import { OrderProductsUseCase } from "@/core/use-cases/order-products";
import { RequestOtpUseCase } from "@/core/use-cases/request-otp";
import { ListCyclesUseCase } from "@/core/use-cases/list-cycles";
import { ListProductsUsecase } from "@/core/use-cases/list-products";
import { FetchBagUseCase } from "@/core/use-cases/fetch-bag";
import { ListCurrentBagsUseCase } from "@/core/use-cases/list-current-bags";
import { PrintBagsReportUseCase } from "@/core/use-cases/print-bags-report";
import { FetchProfileUseCase } from "@/core/use-cases/fetch-profile";
import { ListBoxesUseCase } from "@/core/use-cases/list-boxes";
import { FetchBoxUseCase } from "@/core/use-cases/fetch-box";
import { FetchCatalogUseCase } from "@/core/use-cases/fetch-catalog";
import { FetchLastCatalogUseCase } from "@/core/use-cases/fetch-last-catalog";
import { FetchCurrentBoxUseCase } from "@/core/use-cases/fetch-current-box";
import { ListFarmsUseCase } from "@/core/use-cases/list-farms";
import { FetchCurrentCatalogUseCase } from "@/core/use-cases/fetch-current-catalog";
import { RequestPasswordUpdateUseCase } from "@/core/use-cases/request-password-update";
import { UpdateFarmUseCase } from "@/core/use-cases/update-farm";
import { ListBagsUseCase } from "@/core/use-cases/list-bags";
import { OpenPaymentUseCase } from "@/core/use-cases/open-payment";
import { RegisterPaymentUseCase } from "@/core/use-cases/register-payment";
import { UpdatePaymentUseCase } from "@/core/use-cases/update-payment";
import { FetchFarmUseCase } from "@/core/use-cases/fetch-farm";
import { FetchPendingsUseCase } from "@/core/use-cases/fetch-pendings";
import { RequestHelpUseCase } from "@/core/use-cases/request-help";
import { UpdateBoxUseCase } from "@/core/use-cases/update-box";
import { CreateOfferUseCase } from "@/core/use-cases/create-offer";
import { ListCatalogsUseCase } from "@/core/use-cases/list-catalogs";
import { UpdateBagUseCase } from "@/core/use-cases/update-bag";
import { UpdateCatalogUseCase } from "@/core/use-cases/update-catalog";
import { RegisterProductUseCase } from "@/core/use-cases/register-product";
import { UpdateProductUseCase } from "@/core/use-cases/update-product";
import { FetchSalesStatsUseCase } from "@/core/use-cases/fetch-sales-stats";

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
    updateBoxUseCase: asFunction(
      ({ boxesRepository }) => new UpdateBoxUseCase(boxesRepository)
    ),
    registerFarmUseCase: asFunction(
      ({ usersRepository, farmsRepository }) =>
        new RegisterFarmUseCase(usersRepository, farmsRepository)
    ),
    updateFarmUseCase: asFunction(
      ({ farmsRepository }) => new UpdateFarmUseCase(farmsRepository)
    ),
    createOfferUseCase: asFunction(
      ({
        farmsRepository,
        productsRepository,
        catalogsRepository,
        cyclesRepository,
      }) =>
        new CreateOfferUseCase(
          farmsRepository,
          productsRepository,
          catalogsRepository,
          cyclesRepository
        )
    ),
    updateUserUseCase: asFunction(
      ({ usersRepository, encrypter, storage }) =>
        new UpdateUserUseCase(usersRepository, encrypter, storage)
    ),
    updateCatalogUseCase: asFunction(
      ({ farmsRepository, cyclesRepository, catalogsRepository }) =>
        new UpdateCatalogUseCase(
          farmsRepository,
          cyclesRepository,
          catalogsRepository
        )
    ),
    orderPoductsUseCase: asFunction(
      ({
        usersRepository,
        cyclesRepository,
        offersRepository,
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
    fetchFarmUseCase: asFunction(
      ({ farmsRepository }) => new FetchFarmUseCase(farmsRepository)
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
    listCatalogsUseCase: asFunction(
      ({ cyclesRepository, catalogsRepository }) =>
        new ListCatalogsUseCase(cyclesRepository, catalogsRepository)
    ),
    fetchBoxUseCase: asFunction(
      ({ usersRepository, boxesRepository }) =>
        new FetchBoxUseCase(usersRepository, boxesRepository)
    ),
    fetchCatalogUseCase: asFunction(
      ({ catalogsRepository }) => new FetchCatalogUseCase(catalogsRepository)
    ),
    listProductsUseCase: asFunction(
      ({ productsRepository }) => new ListProductsUsecase(productsRepository)
    ),
    printBagsReportUseCase: asFunction(
      ({ cyclesRepository, bagsRepository, pdfService }) =>
        new PrintBagsReportUseCase(cyclesRepository, bagsRepository, pdfService)
    ),
    updateBagUseCase: asFunction(
      ({ bagsRepository, usersRepository, cyclesRepository }) =>
        new UpdateBagUseCase(bagsRepository, usersRepository, cyclesRepository)
    ),
    fetchBagUseCase: asFunction(
      ({ bagsRepository, usersRepository }) =>
        new FetchBagUseCase(bagsRepository, usersRepository)
    ),
    listCurrentBagsUseCase: asFunction(
      ({ cyclesRepository, bagsRepository }) =>
        new ListCurrentBagsUseCase(cyclesRepository, bagsRepository)
    ),
    fetchLastCatalogUseCase: asFunction(
      ({ cyclesRepository, farmsRepository, catalogsRepository }) =>
        new FetchLastCatalogUseCase(
          cyclesRepository,
          farmsRepository,
          catalogsRepository
        )
    ),
    listFarmsUseCase: asFunction(
      ({ farmsRepository }) => new ListFarmsUseCase(farmsRepository)
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
    listBagsUseCase: asFunction(
      ({ bagsRepository, usersRepository, cyclesRepository }) =>
        new ListBagsUseCase(bagsRepository, usersRepository, cyclesRepository)
    ),
    requestPasswordUpdateUseCase: asFunction(
      ({ usersRepository }) => new RequestPasswordUpdateUseCase(usersRepository)
    ),
    openPaymentUseCase: asFunction(
      ({ bagsRepository, pixProvider }) =>
        new OpenPaymentUseCase(bagsRepository, pixProvider)
    ),
    registerPaymentUseCase: asFunction(
      ({ bagsRepository }) => new RegisterPaymentUseCase(bagsRepository)
    ),
    updatePaymentUseCase: asFunction(
      ({ paymentsRepository }) => new UpdatePaymentUseCase(paymentsRepository)
    ),
    fetchPendingsUseCase: asFunction(
      ({ cyclesRepository, farmsRepository, boxesRepository, cacheManager }) =>
        new FetchPendingsUseCase(
          cyclesRepository,
          farmsRepository,
          boxesRepository,
          cacheManager
        )
    ),
    registerProductUseCase: asFunction(
      ({ productsRepository, storage }) =>
        new RegisterProductUseCase(productsRepository, storage)
    ),
    updateProductUseCase: asFunction(
      ({ usersRepository, productsRepository, storage }) =>
        new UpdateProductUseCase(usersRepository, productsRepository, storage)
    ),
    fetchSalesStatsUseCase: asFunction(
      ({ bagsRepository }) => new FetchSalesStatsUseCase(bagsRepository)
    ),
    requestHelpUseCase: asFunction(
      ({ usersRepository }) => new RequestHelpUseCase(usersRepository)
    ),
  });
};
