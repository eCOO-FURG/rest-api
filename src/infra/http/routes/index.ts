// Libs
import { Router } from "express";

// Controllers
import { authenticateController } from "@/infra/http/controllers/authenticate";
import { deleteOfferController } from "@/infra/http/controllers/delete-offer";
import { fetchBagController } from "@/infra/http/controllers/fetch-bag";
import { fetchBoxController } from "@/infra/http/controllers/fetch-box";
import { fetchCatalogController } from "@/infra/http/controllers/fetch-catalog";
import { fetchCurrentBoxController } from "@/infra/http/controllers/fetch-current-box";
import { fetchCurrentCatalogController } from "@/infra/http/controllers/fetch-current-catalog";
import { fetchLastCatalogController } from "@/infra/http/controllers/fetch-last-catalog";
import { fetchProfileController } from "@/infra/http/controllers/fetch-profile";
import { fetchUserFarmController } from "@/infra/http/controllers/fetch-user-farm";
import { handleBagController } from "@/infra/http/controllers/handle-bag";
import { handleBoxStatusController } from "@/infra/http/controllers/handle-box-status";
import { handleFarmStatusController } from "@/infra/http/controllers/handle-farm-status";
import { listBoxesController } from "@/infra/http/controllers/list-boxes";
import { listCurrentBagsController } from "@/infra/http/controllers/list-current-bags";
import { listCyclesController } from "@/infra/http/controllers/list-cycles";
import { listFarmsController } from "@/infra/http/controllers/list-farms";
import { listProductsController } from "@/infra/http/controllers/list-products";
import { listUserBagsController } from "@/infra/http/controllers/list-user-bags";
import { offerProductsController } from "@/infra/http/controllers/offer-products";
import { openPaymentController } from "@/infra/http/controllers/open-payment";
import { orderProductsController } from "@/infra/http/controllers/order-products";
import { printDeliveriesReportController } from "@/infra/http/controllers/print-deliveries-report";
import { registerController } from "@/infra/http/controllers/register";
import { registerFarmController } from "@/infra/http/controllers/register-farm";
import { registerPaymentController } from "@/infra/http/controllers/register-payment";
import { requestOtpController } from "@/infra/http/controllers/request-otp";
import { requestPasswordUpdateController } from "@/infra/http/controllers/request-password-update";
import { searchCatalogsController } from "@/infra/http/controllers/search-catalogs";
import { updateOfferController } from "@/infra/http/controllers/update-offer";
import { updatePaymentController } from "@/infra/http/controllers/update-payment";
import { updateUserController } from "@/infra/http/controllers/update-user";
import { verifyUserController } from "@/infra/http/controllers/verify-user";
import { updateFarmController } from "../controllers/update-farm";

// Webhooks
import { openPixWebhookListener } from "@/infra/http/webhooks/open-pix";

// Middlewares
import { ensureAdmin } from "@/infra/http/middlewares/ensure-admin";
import { ensureAuthenticated } from "@/infra/http/middlewares/ensure-authenticated";
import { ensureFarmAdmin } from "@/infra/http/middlewares/ensure-farm-admin";
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
router.get(
  "/farms/own",
  ensureAuthenticated,
  ensureFarmAdmin,
  fetchUserFarmController
);
router.post("/farms", ensureAuthenticated, registerFarmController);
router.get(
  "/farms",
  ensureAuthenticated,
  ensureAdmin(["BROKER", "MANAGER"]),
  listFarmsController
);
router.patch(
  "/farms/:farm_id",
  ensureAuthenticated,
  ensureAdmin(["BROKER", "MANAGER"]),
  handleFarmStatusController
);
router.patch(
  "/farms",
  ensureAuthenticated,
  ensureFarmAdmin,
  updateFarmController
);

// Pedidos
router.post("/orders", ensureAuthenticated, orderProductsController);

// Caixas
router.get(
  "/boxes",
  ensureAuthenticated,
  ensureAdmin(["BROKER", "MANAGER"]),
  listBoxesController
);

router.get(
  "/boxes/current",
  ensureAuthenticated,
  ensureFarmAdmin,
  fetchCurrentBoxController
);
router.get(
  "/boxes/:box_id",
  ensureAuthenticated,
  ensureAdmin(["BROKER", "MANAGER"]),
  fetchBoxController
);

router.patch(
  "/boxes/:box_id",
  ensureAuthenticated,
  ensureAdmin(["BROKER", "MANAGER"]),
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
  ensureAdmin(["BROKER", "MANAGER"]),
  listCurrentBagsController
);
router.get(
  "/bags/report/:cycle_id",
  ensureAuthenticated,
  ensureAdmin(["BROKER", "MANAGER"]),
  printDeliveriesReportController
);
router.patch(
  "/bags/:bag_id",
  ensureAuthenticated,
  ensureAdmin(["BROKER", "MANAGER"]),
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
  ensureAdmin(["BROKER", "MANAGER"]),
  registerPaymentController
);
router.post("/payments/open", ensureAuthenticated, openPaymentController);
router.patch(
  "/payments/:payment_id",
  ensureAuthenticated,
  ensureAdmin(["BROKER", "MANAGER"]),
  updatePaymentController
);

// Webhooks
router.post("/webhooks/openpix", ensureIntegration, openPixWebhookListener);
