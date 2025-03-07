// Libraries
import { asFunction, AwilixContainer } from "awilix";

// Use-cases
import { AuthenticateUseCase } from "@/core/use-cases/authenticate";
import { CreateOfferUseCase } from "@/core/use-cases/create-offer";
import { FetchBagUseCase } from "@/core/use-cases/fetch-bag";
import { FetchBoxUseCase } from "@/core/use-cases/fetch-box";
import { FetchCatalogUseCase } from "@/core/use-cases/fetch-catalog";
import { FetchCurrentBoxUseCase } from "@/core/use-cases/fetch-current-box";
import { FetchCurrentCatalogUseCase } from "@/core/use-cases/fetch-current-catalog";
import { FetchFarmUseCase } from "@/core/use-cases/fetch-farm";
import { FetchInboundReportUseCase } from "@/core/use-cases/fetch-inbound-report";
import { FetchLastCatalogUseCase } from "@/core/use-cases/fetch-last-catalog";
import { FetchPendingsUseCase } from "@/core/use-cases/fetch-pendings";
import { FetchProfileUseCase } from "@/core/use-cases/fetch-profile";
import { FetchSalesReportUseCase } from "@/core/use-cases/fetch-sales-report";
import { FetchSalesStatsUseCase } from "@/core/use-cases/fetch-sales-stats";
import { ListBagsUseCase } from "@/core/use-cases/list-bags";
import { ListBoxesUseCase } from "@/core/use-cases/list-boxes";
import { ListCatalogsUseCase } from "@/core/use-cases/list-catalogs";
import { ListCategoriesUseCase } from "@/core/use-cases/list-categories";
import { ListCurrentBagsUseCase } from "@/core/use-cases/list-current-bags";
import { ListCyclesUseCase } from "@/core/use-cases/list-cycles";
import { ListFarmsUseCase } from "@/core/use-cases/list-farms";
import { ListProductsUsecase } from "@/core/use-cases/list-products";
import { OpenPaymentUseCase } from "@/core/use-cases/open-payment";
import { OrderProductsUseCase } from "@/core/use-cases/order-products";
import { RegisterUseCase } from "@/core/use-cases/register";
import { RegisterFarmUseCase } from "@/core/use-cases/register-farm";
import { RegisterPaymentUseCase } from "@/core/use-cases/register-payment";
import { RegisterProductUseCase } from "@/core/use-cases/register-product";
import { RequestHelpUseCase } from "@/core/use-cases/request-help";
import { RequestOtpUseCase } from "@/core/use-cases/request-otp";
import { RequestPasswordUpdateUseCase } from "@/core/use-cases/request-password-update";
import { SendNotificationUseCase } from "@/core/use-cases/send-notification";
import { UpdateBagUseCase } from "@/core/use-cases/update-bag";
import { UpdateBoxUseCase } from "@/core/use-cases/update-box";
import { UpdateCatalogUseCase } from "@/core/use-cases/update-catalog";
import { UpdateFarmUseCase } from "@/core/use-cases/update-farm";
import { UpdatePaymentUseCase } from "@/core/use-cases/update-payment";
import { UpdateProductUseCase } from "@/core/use-cases/update-product";
import { UpdateUserUseCase } from "@/core/use-cases/update-user";
import { VerifyUserUsecase } from "@/core/use-cases/verify-user";

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
      ({ farmsRepository, storage }) =>
        new UpdateFarmUseCase(farmsRepository, storage)
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
        farmsRepository,
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
          farmsRepository,
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
    fetchSalesReportUseCase: asFunction(
      ({
        cyclesRepository,
        bagsRepository,
        catalogsRepository,
        pdfService,
        spreadsheetService,
      }) =>
        new FetchSalesReportUseCase(
          cyclesRepository,
          bagsRepository,
          catalogsRepository,
          pdfService,
          spreadsheetService
        )
    ),
    updateBagUseCase: asFunction(
      ({ bagsRepository, usersRepository, cyclesRepository, chat }) =>
        new UpdateBagUseCase(
          bagsRepository,
          usersRepository,
          cyclesRepository,
          chat
        )
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
      ({ bagsRepository, paymentsRepository, pixProvider }) =>
        new OpenPaymentUseCase(bagsRepository, paymentsRepository, pixProvider)
    ),
    registerPaymentUseCase: asFunction(
      ({ bagsRepository, paymentsRepository }) =>
        new RegisterPaymentUseCase(bagsRepository, paymentsRepository)
    ),
    updatePaymentUseCase: asFunction(
      ({ paymentsRepository, pixProvider }) =>
        new UpdatePaymentUseCase(paymentsRepository, pixProvider)
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
      ({ productsRepository, categoriesRepository, storage }) =>
        new RegisterProductUseCase(
          productsRepository,
          categoriesRepository,
          storage
        )
    ),
    updateProductUseCase: asFunction(
      ({ productsRepository, categoriesRepository, storage }) =>
        new UpdateProductUseCase(
          productsRepository,
          categoriesRepository,
          storage
        )
    ),
    fetchSalesStatsUseCase: asFunction(
      ({ bagsRepository }) => new FetchSalesStatsUseCase(bagsRepository)
    ),
    requestHelpUseCase: asFunction(
      ({ usersRepository }) => new RequestHelpUseCase(usersRepository)
    ),
    sendNotificationUseCase: asFunction(
      ({ usersRepository, mailer }) =>
        new SendNotificationUseCase(usersRepository, mailer)
    ),
    listCategoriesUseCase: asFunction(
      ({ categoriesRepository }) =>
        new ListCategoriesUseCase(categoriesRepository)
    ),
    fetchInboundReportUseCase: asFunction(
      ({ boxesRepository, cyclesRepository, pdfService }) =>
        new FetchInboundReportUseCase(
          boxesRepository,
          cyclesRepository,
          pdfService
        )
    ),
  });
};
