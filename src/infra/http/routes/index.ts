// Libs
import { Router } from "express";

// Controllers
import { registerController } from "@/infra/http/controllers/register";
import { authenticateController } from "@/infra/http/controllers/authenticate";
import { verifyUserController } from "@/infra/http/controllers/verify-user";
import { registerFarmController } from "@/infra/http/controllers/register-farm";
import { orderProductsController } from "@/infra/http/controllers/order-products";
import { offerProductsController } from "@/infra/http/controllers/offer-products";
import { handleOrdersDeliveryController } from "@/infra/http/controllers/handle-orders-delivery";
import { getUserController } from "@/infra/http/controllers/get-profile";

// Middlewares
import { ensureAuthenticated } from "@/infra/http/middlewares/ensure-authenticated";
import { ensureFarmAdmin } from "@/infra/http/middlewares/ensure-farm-admin";
import { requestOtpController } from "@/infra/http/controllers/request-otp";

export const router = Router();

router.post("/users", registerController);
router.get("/users/verify", verifyUserController);
router.get("/me", ensureAuthenticated, getUserController);

router.post("/auth", authenticateController);
router.post("/auth/otp", requestOtpController);

router.patch(
  "/orders",
  ensureAuthenticated,
  ensureFarmAdmin,
  handleOrdersDeliveryController
);

router.post("/farms", ensureAuthenticated, registerFarmController);

router.post("/orders", ensureAuthenticated, orderProductsController);

router.post(
  "/offers",
  ensureAuthenticated,
  ensureFarmAdmin,
  offerProductsController
);
