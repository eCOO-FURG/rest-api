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
import { handleOrdersDeliveryController } from "@/infra/http/controllers/handle-orders-delivery";
import { listFarmsWithOrdersController } from "@/infra/http/controllers/list-farms-with-orders";
import { updateOfferController } from "@/infra/http/controllers/update-offer";
import { getUserController } from "@/infra/http/controllers/get-profile";
import { requestOtpController } from "@/infra/http/controllers/request-otp";
import { listCyclesController } from "@/infra/http/controllers/list-cycles";
import { listFarmOrdersController } from "@/infra/http/controllers/list-farm-orders";
import { searchOfferingFarmsController } from "@/infra/http/controllers/search-offering-farms";
import { listFarmOffersController } from "@/infra/http/controllers/list-farm-offers";
import { listProductsController } from "@/infra/http/controllers/list-products";
import { printDeliveriesReportController } from "../controllers/print-deliveries-report";

// Middlewares
import { ensureAuthenticated } from "@/infra/http/middlewares/ensure-authenticated";
import { ensureFarmAdmin } from "@/infra/http/middlewares/ensure-farm-admin";
import { ensureAdmin } from "@/infra/http/middlewares/ensure-admin";

export const router = Router();

router.post("/users", registerController);
router.patch("/users", ensureAuthenticated, updateUserController);
router.get("/users/verify", verifyUserController);
router.get("/me", ensureAuthenticated, getUserController);

router.post("/auth", authenticateController);
router.post("/auth/otp", requestOtpController);

router.post("/farms", ensureAuthenticated, registerFarmController);

router.post("/orders", ensureAuthenticated, orderProductsController);
router.patch(
  "/orders",
  ensureAuthenticated,
  ensureAdmin,
  handleOrdersDeliveryController
);
router.get("/orders", ensureAuthenticated, listFarmsWithOrdersController);
router.get("/orders/:farm_id", ensureAuthenticated, listFarmOrdersController);

router.post(
  "/offers",
  ensureAuthenticated,
  ensureFarmAdmin,
  offerProductsController
);
router.get("/offers", searchOfferingFarmsController);
router.get("/offers/:farm_id", listFarmOffersController);
router.patch(
  "/offers/:offer_id",
  ensureAuthenticated,
  ensureFarmAdmin,
  updateOfferController
);

router.get("/cycles", listCyclesController);

router.get(
  "/products",
  ensureAuthenticated,
  ensureFarmAdmin,
  listProductsController
);

router.get(
  "/deliveries/report",
  // ensureAuthenticated,
  // ensureAdmin,
  printDeliveriesReportController
);
