// Libs
import { Router } from "express";

// Controllers
import { registerController } from "@/infra/http/controllers/register";
import { authenticateController } from "@/infra/http/controllers/authenticate";
import { verifyUserController } from "@/infra/http/controllers/verify-user";
import { registerFarmController } from "@/infra/http/controllers/register-farm";
import { orderProductsController } from "@/infra/http/controllers/order-products";
import { updateUserController } from "@/infra/http/controllers/update-user";
import { offerProductsController } from "@/infra/http/controllers/offer-products";
import { listBoxesController } from "@/infra/http/controllers/list-boxes";
import { updateOfferController } from "@/infra/http/controllers/update-offer";
import { fetchProfileController } from "@/infra/http/controllers/fetch-profile";
import { requestOtpController } from "@/infra/http/controllers/request-otp";
import { listCyclesController } from "@/infra/http/controllers/list-cycles";
import { fetchBoxController } from "@/infra/http/controllers/fetch-box";
import { searchCatalogsController } from "@/infra/http/controllers/search-catalogs";
import { fetchCatalogController } from "@/infra/http/controllers/fetch-catalog";
import { listProductsController } from "@/infra/http/controllers/list-products";
import { printDeliveriesReportController } from "@/infra/http/controllers/print-deliveries-report";
import { listCurrentBagsController } from "@/infra/http/controllers/list-current-bags";
import { fetchBagController } from "@/infra/http/controllers/fetch-bag";
import { handleBagController } from "@/infra/http/controllers/handle-bag";
import { handleBoxStatusController } from "@/infra/http/controllers/handle-box-status";
import { fetchLastCatalogController } from "@/infra/http/controllers/fetch-last-catalog";
import { deleteOfferController } from "@/infra/http/controllers/delete-offer";
import { listFarmsController } from "@/infra/http/controllers/list-farms";
import { handleFarmStatusController } from "@/infra/http/controllers/handle-farm-status";
import { fetchCurrentBoxController } from "@/infra/http/controllers/fetch-current-box";
import { fetchCurrentCatalogController } from "@/infra/http/controllers/fetch-current-catalog";
import { requestPasswordUpdateController } from "@/infra/http/controllers/request-password-update";
import { fetchUserBagController } from "@/infra/http/controllers/fetch-user-bag";
import { listUserBagsController } from "@/infra/http/controllers/list-user-bags";
import { openPaymentController } from "@/infra/http/controllers/open-payment";
import { registerPaymentController } from "@/infra/http/controllers/register-payment";
import { updatePaymentController } from "@/infra/http/controllers/update-payment";
import { fetchUserFarmController } from "@/infra/http/controllers/fetch-user-farm";

// Webhooks
import { openPixWebhookListener } from "@/infra/http/webooks/open-pix";

// Middlewares
import { ensureAuthenticated } from "@/infra/http/middlewares/ensure-authenticated";
import { ensureFarmAdmin } from "@/infra/http/middlewares/ensure-farm-admin";
import { ensureAdmin } from "@/infra/http/middlewares/ensure-admin";
import { ensureIntegration } from "@/infra/http/middlewares/ensure-integration";

export const router = Router();

// Usuários
router.post("/users", registerController);
router.patch("/users", ensureAuthenticated, updateUserController);
router.get("/users/verify", verifyUserController);
router.get("/me", ensureAuthenticated, fetchProfileController);
router.post("/users/password", requestPasswordUpdateController);

// Autenticação
router.post("/auth", authenticateController);
router.post("/auth/otp", requestOtpController);

// Fazendas
router.get("/me/farm", ensureAuthenticated, ensureFarmAdmin, fetchUserFarmController)
router.post("/farms", ensureAuthenticated, registerFarmController);
router.get("/farms", ensureAuthenticated, ensureAdmin, listFarmsController);
router.patch(
  "/farms/:farm_id",
  ensureAuthenticated,
  ensureAdmin,
  handleFarmStatusController
);

// Pedidos
router.post("/orders", ensureAuthenticated, orderProductsController);

// Caixas
router.get("/boxes", ensureAuthenticated, ensureAdmin, listBoxesController);

router.get(
  "/boxes/current",
  ensureAuthenticated,
  ensureFarmAdmin,
  fetchCurrentBoxController
);
router.get(
  "/boxes/:box_id",
  ensureAuthenticated,
  ensureAdmin,
  fetchBoxController
);

router.patch(
  "/boxes/:box_id",
  ensureAuthenticated,
  ensureAdmin,
  handleBoxStatusController
);

// Ofertas
router.post(
  "/offers",
  ensureAuthenticated,
  ensureFarmAdmin,
  offerProductsController
);
router.patch(
  "/offers/:offer_id",
  ensureAuthenticated,
  ensureFarmAdmin,
  updateOfferController
);
router.delete(
  "/offers/:offer_id",
  ensureAuthenticated,
  ensureFarmAdmin,
  deleteOfferController
);

// Catalogos
router.get("/catalogs", searchCatalogsController);
router.get("/catalogs/:catalog_id", fetchCatalogController);
router.get(
  "/catalogs/current/:cycle_id",
  ensureAuthenticated,
  ensureFarmAdmin,
  fetchCurrentCatalogController
);
router.get(
  "/catalogs/last/:cycle_id",
  ensureAuthenticated,
  ensureFarmAdmin,
  fetchLastCatalogController
);

// Sacolas
router.get(
  "/bags/current",
  ensureAuthenticated,
  ensureAdmin,
  listCurrentBagsController
);
router.get(
  "/bags/report/:cycle_id",
  ensureAuthenticated,
  ensureAdmin,
  printDeliveriesReportController
);
router.patch(
  "/bags/:bag_id",
  ensureAuthenticated,
  ensureAdmin,
  handleBagController
);
router.get("/bags/:bag_id", ensureAuthenticated, fetchBagController);
router.get("/me/bags", ensureAuthenticated, listUserBagsController);

// Ciclos
router.get("/cycles", listCyclesController);

// Produtos
router.get(
  "/products",
  ensureAuthenticated,
  ensureFarmAdmin,
  listProductsController
);

// Pagamentos
router.post(
  "/payments",
  ensureAuthenticated,
  ensureAdmin,
  registerPaymentController
);
router.post("/payments/open", ensureAuthenticated, openPaymentController);
router.patch(
  "/payments/:payment_id",
  ensureAuthenticated,
  ensureAdmin,
  updatePaymentController
);

// Webhooks
router.post("/webhooks/openpix", ensureIntegration, openPixWebhookListener);
