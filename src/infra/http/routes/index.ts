// Libs
import { Router } from "express";

// Controllers
import { authenticateController } from "@/infra/http/controllers/authenticate";
import { fetchBagController } from "@/infra/http/controllers/fetch-bag";
import { fetchBoxController } from "@/infra/http/controllers/fetch-box";
import { fetchCatalogController } from "@/infra/http/controllers/fetch-catalog";
import { fetchCurrentBoxController } from "@/infra/http/controllers/fetch-current-box";
import { fetchCurrentCatalogController } from "@/infra/http/controllers/fetch-current-catalog";
import { fetchFarmController } from "@/infra/http/controllers/fetch-farm";
import { fetchLastCatalogController } from "@/infra/http/controllers/fetch-last-catalog";
import { fetchPendingsController } from "@/infra/http/controllers/fetch-pendings";
import { fetchProfileController } from "@/infra/http/controllers/fetch-profile";
import { fetchUserFarmController } from "@/infra/http/controllers/fetch-user-farm";
import { handleBagController } from "@/infra/http/controllers/handle-bag";
import { handleBoxController } from "@/infra/http/controllers/handle-box";
import { handleFarmController } from "@/infra/http/controllers/handle-farm";
import { listBoxesController } from "@/infra/http/controllers/list-boxes";
import { listCurrentBagsController } from "@/infra/http/controllers/list-current-bags";
import { listCyclesController } from "@/infra/http/controllers/list-cycles";
import { listFarmsController } from "@/infra/http/controllers/list-farms";
import { listProductsController } from "@/infra/http/controllers/list-products";
import { listBagsController } from "@/infra/http/controllers/list-bags";
import { listOwnBagsController } from "@/infra/http/controllers/list-own-bags";
import { createOfferController } from "@/infra/http/controllers/create-offer";
import { openPaymentController } from "@/infra/http/controllers/open-payment";
import { orderProductsController } from "@/infra/http/controllers/order-products";
import { printDeliveriesReportController } from "@/infra/http/controllers/print-deliveries-report";
import { registerController } from "@/infra/http/controllers/register";
import { registerFarmController } from "@/infra/http/controllers/register-farm";
import { registerPaymentController } from "@/infra/http/controllers/register-payment";
import { requestOtpController } from "@/infra/http/controllers/request-otp";
import { requestPasswordUpdateController } from "@/infra/http/controllers/request-password-update";
import { listCatalogsController } from "@/infra/http/controllers/list-catalogs";
import { updateFarmController } from "@/infra/http/controllers/update-farm";
import { updateUserController } from "@/infra/http/controllers/update-user";
import { verifyUserController } from "@/infra/http/controllers/verify-user";
import { updateCatalogController } from "@/infra/http/controllers/update-catalog";
import { updateBagController } from "@/infra/http/controllers/update-bag";
import { registerProductController } from "@/infra/http/controllers/register-product";

// Webhooks
import { openPixWebhookListener } from "@/infra/http/webhooks/open-pix";

// Middlewares
import { ensureAuthenticated } from "@/infra/http/middlewares/ensure-authenticated";
import { ensureIntegration } from "@/infra/http/middlewares/ensure-integration";
import { ensureRole } from "@/infra/http/middlewares/ensure-role";
import { processFile } from "@/infra/http/middlewares/process-files";

export const router = Router();

// Usuários
router.post("/users", registerController);
router.get("/me", ensureAuthenticated, fetchProfileController);
router.patch(
  "/me",
  ensureAuthenticated,
  processFile("photo", { allowed: ["image/jpeg", "image/png"], size: 1 }),
  updateUserController
);
router.get("/me/verify", verifyUserController);

// Autenticação
router.post("/auth", authenticateController);
router.post("/auth/otp", requestOtpController);
router.post("/auth/password", requestPasswordUpdateController);

// Fazendas
router.get(
  "/farms/own",
  ensureAuthenticated,
  ensureRole(["PRODUCER"]),
  fetchUserFarmController
);
router.get("/farms/:farm_id", ensureAuthenticated, fetchFarmController);
router.post("/farms", ensureAuthenticated, registerFarmController);
router.get(
  "/farms",
  ensureAuthenticated,
  ensureRole(["BROKER", "MANAGER"]),
  listFarmsController
);
router.patch(
  "/farms/:farm_id/handle",
  ensureAuthenticated,
  ensureRole(["MANAGER"]),
  handleFarmController
);
router.patch(
  "/farms/own",
  ensureAuthenticated,
  ensureRole(["PRODUCER"]),
  updateFarmController
);

// Pedidos
router.post("/bags", ensureAuthenticated, orderProductsController);

// Caixas
router.get(
  "/boxes/current",
  ensureAuthenticated,
  ensureRole(["PRODUCER"]),
  fetchCurrentBoxController
);
router.get(
  "/boxes/:box_id",
  ensureAuthenticated,
  ensureRole(["BROKER"]),
  fetchBoxController
);
router.patch(
  "/boxes/:box_id/handle",
  ensureAuthenticated,
  ensureRole(["BROKER"]),
  handleBoxController
);
router.get(
  "/boxes",
  ensureAuthenticated,
  ensureRole(["BROKER"]),
  listBoxesController
);

// Ofertas
router.post(
  "/catalogs",
  ensureAuthenticated,
  ensureRole(["PRODUCER"]),
  createOfferController
);

// Catalogos
router.get(
  "/catalogs/current",
  ensureAuthenticated,
  ensureRole(["PRODUCER"]),
  fetchCurrentCatalogController
);
router.get(
  "/catalogs/last/",
  ensureAuthenticated,
  ensureRole(["PRODUCER"]),
  fetchLastCatalogController
);
router.get("/catalogs", listCatalogsController);
router.get("/catalogs/:catalog_id", fetchCatalogController);

router.patch(
  "/catalogs/:catalog_id",
  ensureAuthenticated,
  ensureRole(["PRODUCER"]),
  updateCatalogController
);

// Sacolas
router.get(
  "/bags/current",
  ensureAuthenticated,
  ensureRole(["BROKER"]),
  listCurrentBagsController
);
router.get(
  "/reports",
  ensureAuthenticated,
  ensureRole(["BROKER", "MANAGER"]),
  printDeliveriesReportController
);
router.get(
  "/bags",
  ensureAuthenticated,
  ensureRole(["BROKER"]),
  listBagsController
);
router.get("/bags/own", ensureAuthenticated, listOwnBagsController);
router.patch(
  "/bags/:bag_id/handle",
  ensureAuthenticated,
  ensureRole(["BROKER"]),
  handleBagController
);
router.get("/bags/:bag_id", ensureAuthenticated, fetchBagController);
router.post("/bags/:bag_id/open", ensureAuthenticated, openPaymentController);
router.post(
  "/bags/:bag_id/pay",
  ensureAuthenticated,
  registerPaymentController
);
router.patch(
  "/bags/:bag_id/handle",
  ensureAuthenticated,
  ensureRole(["BROKER"]),
  handleBagController
);
router.patch("/bags/:bag_id", ensureAuthenticated, updateBagController);

// Ciclos
router.get("/cycles", listCyclesController);

// Produtos
router.get("/products", ensureAuthenticated, listProductsController);
router.post("/products", ensureAuthenticated, ensureRole(["MANAGER"]), registerProductController)

// Pendências
router.get(
  "/pendings",
  ensureAuthenticated,
  ensureRole(["BROKER"]),
  fetchPendingsController
);

// Webhooks
router.post("/webhooks/openpix", ensureIntegration, openPixWebhookListener);
