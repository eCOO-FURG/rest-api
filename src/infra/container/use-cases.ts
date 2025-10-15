// Libraries
import { asFunction, AwilixContainer } from "awilix";

// Use-cases
import { AuthenticateUseCase } from "@/core/use-cases/authenticate";
import { DeleteFarmImageUseCase } from "@/core/use-cases/delete-farm-image";
import { DeleteOfferUseCase } from "@/core/use-cases/delete-offer";
import { FetchBagUseCase } from "@/core/use-cases/fetch-bag";
import { FetchBoxUseCase } from "@/core/use-cases/fetch-box";
import { FetchCatalogUseCase } from "@/core/use-cases/fetch-catalog";
import { FetchCategoryUseCase } from "@/core/use-cases/fetch-category";
import { FetchCurrentBoxUseCase } from "@/core/use-cases/fetch-current-box";
import { FetchFarmUseCase } from "@/core/use-cases/fetch-farm";
import { FetchInboundReportUseCase } from "@/core/use-cases/fetch-inbound-report";
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
import { ListOffersUseCase } from "@/core/use-cases/list-offers";
import { ListProductsUsecase } from "@/core/use-cases/list-products";
import { ListUsersUseCase } from "@/core/use-cases/list-users";
import { OpenPaymentUseCase } from "@/core/use-cases/open-payment";
import { RegisterUseCase } from "@/core/use-cases/register";
import { RegisterFarmUseCase } from "@/core/use-cases/register-farm";
import { RegisterFarmImageUseCase } from "@/core/use-cases/register-farm-image";
import { RegisterOfferUseCase } from "@/core/use-cases/register-offer";
import { RegisterOrderUseCase } from "@/core/use-cases/register-order";
import { RegisterPaymentUseCase } from "@/core/use-cases/register-payment";
import { RegisterProductUseCase } from "@/core/use-cases/register-product";
import { RequestHelpUseCase } from "@/core/use-cases/request-help";
import { RequestOtpUseCase } from "@/core/use-cases/request-otp";
import { ResetPasswordUseCase } from "@/core/use-cases/reset-password";
import { SendNotificationUseCase } from "@/core/use-cases/send-notification";
import { UpdateBagUseCase } from "@/core/use-cases/update-bag";
import { UpdateFarmUseCase } from "@/core/use-cases/update-farm";
import { UpdateOfferUseCase } from "@/core/use-cases/update-offer";
import { UpdateOrderUseCase } from "@/core/use-cases/update-order";
import { UpdatePaymentUseCase } from "@/core/use-cases/update-payment";
import { UpdateProductUseCase } from "@/core/use-cases/update-product";
import { UpdateUserUseCase } from "@/core/use-cases/update-user";
import { VerifyUserUsecase } from "@/core/use-cases/verify-user";
import { FetchDescriptionSuggestionUseCase } from "@/core/use-cases/fetch-description-suggestion";
import { FetchWarehouseUseCase } from "@/core/use-cases/fetch-warehouse";
import { UpdateWarehouseUseCase } from "@/core/use-cases/update-warehouse";
import { UpdateMarketUseCase } from "@/core/use-cases/update-market";
import { RegisterMarketUseCase } from "@/core/use-cases/register-market";
import { FetchMarketUseCase } from "@/core/use-cases/fetch-market";
import { ListMarketsUseCase } from "@/core/use-cases/list-markets";

export default (container: AwilixContainer) => {
  container.register({
    registerUsecase: asFunction(
      ({ usersRepository, encrypter, hasher, storage, mailer }) =>
        new RegisterUseCase(usersRepository, encrypter, hasher, storage, mailer),
    ),
    authenticateUseCase: asFunction(
      ({
        usersRepository,
        farmsRepository,
        otpsRepository,
        sessionsRepository,
        encrypter,
        hasher,
      }) =>
        new AuthenticateUseCase(
          usersRepository,
          farmsRepository,
          otpsRepository,
          sessionsRepository,
          encrypter,
          hasher,
        ),
    ),
    verifyUserUseCase: asFunction(
      ({ usersRepository, sessionsRepository, hasher }) =>
        new VerifyUserUsecase(usersRepository, sessionsRepository, hasher),
    ),
    listUsersUseCase: asFunction(({ usersRepository }) => new ListUsersUseCase(usersRepository)),
    registerFarmUseCase: asFunction(
      ({ usersRepository, farmsRepository }) =>
        new RegisterFarmUseCase(usersRepository, farmsRepository),
    ),
    updateFarmUseCase: asFunction(
      ({ farmsRepository, usersRepository, storage }) =>
        new UpdateFarmUseCase(farmsRepository, usersRepository, storage),
    ),
    registerOfferUseCase: asFunction(
      ({
        farmsRepository,
        productsRepository,
        marketsRepository,
        cyclesRepository,
        offersRepository,
      }) =>
        new RegisterOfferUseCase(
          farmsRepository,
          productsRepository,
          cyclesRepository,
          marketsRepository,
          offersRepository,
        ),
    ),
    updateUserUseCase: asFunction(
      ({ usersRepository, encrypter, storage }) =>
        new UpdateUserUseCase(usersRepository, encrypter, storage),
    ),
    registerOrderUseCase: asFunction(
      ({
        usersRepository,
        cyclesRepository,
        marketsRepository,
        offersRepository,
        bagsRepository,
        boxesRepository,
        addressesRepository,
        mailer,
      }) =>
        new RegisterOrderUseCase(
          usersRepository,
          cyclesRepository,
          marketsRepository,
          offersRepository,
          bagsRepository,
          boxesRepository,
          addressesRepository,
          mailer,
        ),
    ).transient(),
    updateOrderUseCase: asFunction(
      ({ usersRepository, bagsRepository, ordersRepository }) =>
        new UpdateOrderUseCase(usersRepository, bagsRepository, ordersRepository),
    ),
    fetchProfileUseCase: asFunction(
      ({ usersRepository }) => new FetchProfileUseCase(usersRepository),
    ),
    fetchFarmUseCase: asFunction(({ farmsRepository }) => new FetchFarmUseCase(farmsRepository)),
    requestOtpUseCase: asFunction(
      ({ usersRepository, otpsRepository, mailer }) =>
        new RequestOtpUseCase(usersRepository, otpsRepository, mailer),
    ),
    listBoxesUseCase: asFunction(
      ({ cyclesRepository, boxesRepository }) =>
        new ListBoxesUseCase(cyclesRepository, boxesRepository),
    ),
    listCyclesUseCase: asFunction(
      ({ cyclesRepository }) => new ListCyclesUseCase(cyclesRepository),
    ),
    listCatalogsUseCase: asFunction(
      ({ cyclesRepository, farmsRepository, categoriesRepository }) =>
        new ListCatalogsUseCase(cyclesRepository, farmsRepository, categoriesRepository),
    ),
    fetchBoxUseCase: asFunction(
      ({ usersRepository, boxesRepository }) =>
        new FetchBoxUseCase(usersRepository, boxesRepository),
    ),
    fetchCatalogUseCase: asFunction(
      ({ farmsRepository }) => new FetchCatalogUseCase(farmsRepository),
    ),
    listProductsUseCase: asFunction(
      ({ productsRepository }) => new ListProductsUsecase(productsRepository),
    ),
    fetchSalesReportUseCase: asFunction(
      ({ cyclesRepository, farmsRepository, bagsRepository, pdfService, spreadsheetService }) =>
        new FetchSalesReportUseCase(
          cyclesRepository,
          farmsRepository,
          bagsRepository,
          pdfService,
          spreadsheetService,
        ),
    ),
    updateBagUseCase: asFunction(
      ({ bagsRepository, usersRepository, chat }) =>
        new UpdateBagUseCase(bagsRepository, usersRepository, chat),
    ),
    fetchBagUseCase: asFunction(
      ({ bagsRepository, usersRepository }) => new FetchBagUseCase(bagsRepository, usersRepository),
    ),
    listCurrentBagsUseCase: asFunction(
      ({ cyclesRepository, bagsRepository }) =>
        new ListCurrentBagsUseCase(cyclesRepository, bagsRepository),
    ),
    listFarmsUseCase: asFunction(({ farmsRepository }) => new ListFarmsUseCase(farmsRepository)),
    fetchCurrentBoxUseCase: asFunction(
      ({ boxesRepository, cyclesRepository, farmsRepository }) =>
        new FetchCurrentBoxUseCase(boxesRepository, cyclesRepository, farmsRepository),
    ),
    listBagsUseCase: asFunction(
      ({ bagsRepository, usersRepository, cyclesRepository }) =>
        new ListBagsUseCase(bagsRepository, usersRepository, cyclesRepository),
    ),
    resetPasswordUseCase: asFunction(
      ({ usersRepository, hasher, mailer }) =>
        new ResetPasswordUseCase(usersRepository, hasher, mailer),
    ),
    openPaymentUseCase: asFunction(
      ({ bagsRepository, paymentsRepository, pixProvider }) =>
        new OpenPaymentUseCase(bagsRepository, paymentsRepository, pixProvider),
    ),
    registerPaymentUseCase: asFunction(
      ({ bagsRepository, paymentsRepository }) =>
        new RegisterPaymentUseCase(bagsRepository, paymentsRepository),
    ),
    updatePaymentUseCase: asFunction(
      ({ paymentsRepository, pixProvider }) =>
        new UpdatePaymentUseCase(paymentsRepository, pixProvider),
    ),
    fetchPendingsUseCase: asFunction(
      ({ cyclesRepository, farmsRepository, boxesRepository, cacheManager }) =>
        new FetchPendingsUseCase(cyclesRepository, farmsRepository, boxesRepository, cacheManager),
    ),
    registerProductUseCase: asFunction(
      ({ productsRepository, categoriesRepository, storage }) =>
        new RegisterProductUseCase(productsRepository, categoriesRepository, storage),
    ),
    updateProductUseCase: asFunction(
      ({ productsRepository, categoriesRepository, storage }) =>
        new UpdateProductUseCase(productsRepository, categoriesRepository, storage),
    ),
    fetchSalesStatsUseCase: asFunction(
      ({ bagsRepository }) => new FetchSalesStatsUseCase(bagsRepository),
    ),
    requestHelpUseCase: asFunction(
      ({ usersRepository, farmsRepository, mailer }) =>
        new RequestHelpUseCase(usersRepository, farmsRepository, mailer),
    ),
    sendNotificationUseCase: asFunction(
      ({ usersRepository, mailer }) => new SendNotificationUseCase(usersRepository, mailer),
    ),
    listCategoriesUseCase: asFunction(
      ({ cyclesRepository, categoriesRepository }) =>
        new ListCategoriesUseCase(cyclesRepository, categoriesRepository),
    ),
    fetchInboundReportUseCase: asFunction(
      ({ boxesRepository, cyclesRepository, pdfService }) =>
        new FetchInboundReportUseCase(boxesRepository, cyclesRepository, pdfService),
    ),
    registerFarmImageUseCase: asFunction(
      ({ farmsRepository, usersRepository, storage }) =>
        new RegisterFarmImageUseCase(farmsRepository, usersRepository, storage),
    ),
    deleteFarmImageUseCase: asFunction(
      ({ farmsRepository, usersRepository, storage }) =>
        new DeleteFarmImageUseCase(farmsRepository, usersRepository, storage),
    ),
    deleteOfferUseCase: asFunction(
      ({ offersRepository, cyclesRepository, marketsRepository }) =>
        new DeleteOfferUseCase(offersRepository, cyclesRepository, marketsRepository),
    ),
    updateOfferUseCase: asFunction(
      ({ offersRepository, cyclesRepository, marketsRepository }) =>
        new UpdateOfferUseCase(offersRepository, cyclesRepository, marketsRepository),
    ),
    fetchCategoryUseCase: asFunction(
      ({ categoriesRepository, cyclesRepository }) =>
        new FetchCategoryUseCase(categoriesRepository, cyclesRepository),
    ),
    listOffersUseCase: asFunction(
      ({ offersRepository, cyclesRepository, categoriesRepository }) =>
        new ListOffersUseCase(offersRepository, cyclesRepository, categoriesRepository),
    ),
    fetchDescriptionSuggestionUseCase: asFunction(
      ({ productsRepository, llmProvider }) =>
        new FetchDescriptionSuggestionUseCase(productsRepository, llmProvider),
    ),
    fetchWarehouseUseCase: asFunction(
      ({ warehouseRepository }) => new FetchWarehouseUseCase(warehouseRepository),
    ),
    updateWarehouseUseCase: asFunction(
      ({ usersRepository, warehouseRepository }) =>
        new UpdateWarehouseUseCase(usersRepository, warehouseRepository),
    ),
    registerMarketUseCase: asFunction(
      ({ marketsRepository }) => new RegisterMarketUseCase(marketsRepository),
    ),
    updateMarketUseCase: asFunction(
      ({ marketsRepository }) => new UpdateMarketUseCase(marketsRepository),
    ),
    fetchMarketUseCase: asFunction(
      ({ marketsRepository }) => new FetchMarketUseCase(marketsRepository),
    ),
    listMarketsUseCase: asFunction(
      ({ marketsRepository }) => new ListMarketsUseCase(marketsRepository),
    ),
  });
};
