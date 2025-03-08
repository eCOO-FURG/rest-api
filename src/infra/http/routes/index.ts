// Libraries
import { Router } from "express";

// Middlewares
import { logging } from "@/infra/http/middlewares/logging";

// Controllers
import { authenticateController } from "@/infra/http/controllers/authenticate";
import { createOfferController } from "@/infra/http/controllers/create-offer";
import { fetchBagController } from "@/infra/http/controllers/fetch-bag";
import { fetchBoxController } from "@/infra/http/controllers/fetch-box";
import { fetchCatalogController } from "@/infra/http/controllers/fetch-catalog";
import { fetchCurrentBoxController } from "@/infra/http/controllers/fetch-current-box";
import { fetchCurrentCatalogController } from "@/infra/http/controllers/fetch-current-catalog";
import { fetchFarmController } from "@/infra/http/controllers/fetch-farm";
import { fetchLastCatalogController } from "@/infra/http/controllers/fetch-last-catalog";
import { fetchPendingsController } from "@/infra/http/controllers/fetch-pendings";
import { fetchProfileController } from "@/infra/http/controllers/fetch-profile";
import { fetchSalesStatsController } from "@/infra/http/controllers/fetch-sales-stats";
import { fetchUserFarmController } from "@/infra/http/controllers/fetch-user-farm";
import { handleFarmController } from "@/infra/http/controllers/handle-farm";
import { listBagsController } from "@/infra/http/controllers/list-bags";
import { listBoxesController } from "@/infra/http/controllers/list-boxes";
import { listCatalogsController } from "@/infra/http/controllers/list-catalogs";
import { listCategoriesController } from "@/infra/http/controllers/list-categories";
import { listCurrentBagsController } from "@/infra/http/controllers/list-current-bags";
import { listCyclesController } from "@/infra/http/controllers/list-cycles";
import { listFarmsController } from "@/infra/http/controllers/list-farms";
import { listOwnBagsController } from "@/infra/http/controllers/list-own-bags";
import { listProductsController } from "@/infra/http/controllers/list-products";
import { openPaymentController } from "@/infra/http/controllers/open-payment";
import { orderProductsController } from "@/infra/http/controllers/order-products";
import { fetchSalesReportController } from "@/infra/http/controllers/fetch-sales-report";
import { registerController } from "@/infra/http/controllers/register";
import { registerFarmController } from "@/infra/http/controllers/register-farm";
import { registerPaymentController } from "@/infra/http/controllers/register-payment";
import { registerProductController } from "@/infra/http/controllers/register-product";
import { requestHelpController } from "@/infra/http/controllers/request-help";
import { requestOtpController } from "@/infra/http/controllers/request-otp";
import { requestPasswordUpdateController } from "@/infra/http/controllers/request-password-update";
import { sendNotificationController } from "@/infra/http/controllers/send-notification";
import { updateBagController } from "@/infra/http/controllers/update-bag";
import { updateFarmController } from "@/infra/http/controllers/update-farm";
import { updateProductController } from "@/infra/http/controllers/update-product";
import { updateUserController } from "@/infra/http/controllers/update-user";
import { verifyUserController } from "@/infra/http/controllers/verify-user";
import { updatePaymentController } from "@/infra/http/controllers/update-payment";
import { fetchInboundReportController } from "@/infra/http/controllers/fetch-inbound-report";

// Webhooks
import { openPixWebhookListener } from "@/infra/http/webhooks/open-pix";

// Middlewares
import { ensureAuthenticated } from "@/infra/http/middlewares/ensure-authenticated";
import { ensureIntegration } from "@/infra/http/middlewares/ensure-integration";
import { ensureRole } from "@/infra/http/middlewares/ensure-role";
import { processFiles } from "@/infra/http/middlewares/process-files";

export const router = Router();

router.use(logging());

// Usuários
router.post("/users", registerController);
router.get("/me", ensureAuthenticated, fetchProfileController);
router.patch(
  "/me",
  ensureAuthenticated,
  processFiles([
    {
      name: "photo",
      options: { allowed: ["image/jpeg", "image/png"], size: 1 },
    },
  ]),
  updateUserController
);
router.post(
  "/help",
  ensureAuthenticated,
  ensureRole(["PRODUCER"]),
  requestHelpController
);

// Autenticação
router.post("/auth", authenticateController);
router.post("/auth/otp", requestOtpController);
router.post("/auth/password", requestPasswordUpdateController);
router.get("/verify", verifyUserController);

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
  processFiles([
    {
      name: "photo",
      options: { allowed: ["image/jpeg", "image/png"], size: 1 },
    },
    {
      name: "add_images",
      options: { allowed: ["image/jpeg", "image/png"], size: 1, max: 4 },
    },
  ]),
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

// Sacolas
router.get(
  "/bags/current",
  ensureAuthenticated,
  ensureRole(["BROKER"]),
  listCurrentBagsController
);
router.get(
  "/bags",
  ensureAuthenticated,
  ensureRole(["BROKER", "MANAGER"]),
  listBagsController
);
router.get("/bags/own", ensureAuthenticated, listOwnBagsController);

router.get("/bags/:bag_id", ensureAuthenticated, fetchBagController);
router.post("/bags/:bag_id/open", ensureAuthenticated, openPaymentController);
router.patch("/bags/:bag_id", ensureAuthenticated, updateBagController);

// Pagamentos
router.post(
  "/payments",
  ensureAuthenticated,
  ensureRole(["MANAGER", "BROKER"]),
  registerPaymentController
);
router.patch(
  "/payments/:payment_id",
  ensureAuthenticated,
  ensureRole(["MANAGER"]),
  updatePaymentController
);

// Ciclos
router.get("/cycles", listCyclesController);

// Produtos
router.get("/products", ensureAuthenticated, listProductsController);
router.post(
  "/products",
  ensureAuthenticated,
  ensureRole(["MANAGER"]),
  processFiles([
    {
      name: "image",
      options: { allowed: ["image/jpeg", "image/png"], size: 1 },
    },
  ]),
  registerProductController
);
router.patch(
  "/products/:product_id",
  ensureAuthenticated,
  ensureRole(["MANAGER"]),
  processFiles([
    {
      name: "image",
      options: { allowed: ["image/jpeg", "image/png"], size: 1 },
    },
  ]),
  updateProductController
);

// Categorias
router.get("/categories", ensureAuthenticated, listCategoriesController);

// Pendências
router.get(
  "/pendings",
  ensureAuthenticated,
  ensureRole(["BROKER"]),
  fetchPendingsController
);

// Estatísticas
router.get(
  "/stats",
  ensureAuthenticated,
  ensureRole(["MANAGER"]),
  fetchSalesStatsController
);

// Relatórios
router.get(
  "/reports/sales",
  ensureAuthenticated,
  ensureRole(["BROKER", "MANAGER"]),
  fetchSalesReportController
);

router.get(
  "/reports/inbound",
  ensureAuthenticated,
  ensureRole(["BROKER", "MANAGER"]),
  fetchInboundReportController
);

// Notificações
router.post(
  "/notifications",
  ensureAuthenticated,
  ensureRole(["MANAGER"]),
  processFiles([
    {
      name: "files",
      options: {
        allowed: ["application/pdf", "image/jpeg", "image/png"],
        size: 5,
        max: 5,
      },
    },
  ]),
  sendNotificationController
);

// Webhooks
router.post("/webhooks/openpix", ensureIntegration, openPixWebhookListener);
