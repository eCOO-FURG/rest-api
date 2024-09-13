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
import { printDeliveriesReportController } from "../controllers/print-deliveries-report";
import { listBagsController } from "@/infra/http/controllers/list-bags";
import { fetchBagController } from "@/infra/http/controllers/fetch-bag";
import { handleBagController } from "@/infra/http/controllers/handle-bag";
import { handleBoxStatusController } from "@/infra/http/controllers/handle-box-status";
import { fetchLastCatalogController } from "@/infra/http/controllers/fetch-last-catalog";

// Middlewares
import { ensureAuthenticated } from "@/infra/http/middlewares/ensure-authenticated";
import { ensureFarmAdmin } from "@/infra/http/middlewares/ensure-farm-admin";
import { ensureAdmin } from "@/infra/http/middlewares/ensure-admin";

export const router = Router();

router.post("/users", registerController);
router.patch("/users", ensureAuthenticated, updateUserController);
router.get("/users/verify", verifyUserController);
router.get("/me", ensureAuthenticated, fetchProfileController);

router.post("/auth", authenticateController);
router.post("/auth/otp", requestOtpController);

router.post("/farms", ensureAuthenticated, registerFarmController);

router.post("/orders", ensureAuthenticated, orderProductsController);

router.patch(
  "/boxes/:box_id",
  ensureAuthenticated,
  ensureAdmin,
  handleBoxStatusController
);
router.get("/boxes", ensureAuthenticated, ensureAdmin, listBoxesController);
router.get("/boxes/:box_id", ensureAuthenticated, fetchBoxController);


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

router.get("/catalogs", searchCatalogsController);
router.get("/catalogs/:catalog_id", fetchCatalogController);
router.get(
  "/catalogs/last/:cycle_id",
  ensureAuthenticated,
  ensureFarmAdmin,
  fetchLastCatalogController
);

router.get("/bags", ensureAuthenticated, ensureAdmin, listBagsController);
router.get(
  "/bags/:bag_id",
  ensureAuthenticated,
  ensureAdmin,
  fetchBagController
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

router.get("/cycles", listCyclesController);

router.get(
  "/products",
  ensureAuthenticated,
  ensureFarmAdmin,
  listProductsController
);
