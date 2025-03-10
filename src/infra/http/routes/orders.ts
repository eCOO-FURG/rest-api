// Libraries
import { Router } from "express";

// Middlewares
import { ensureAuthenticated } from "@/infra/http/middlewares/ensure-authenticated";
import { ensureRole } from "@/infra/http/middlewares/ensure-role";

// Controllers
import { orderProductsController } from "@/infra/http/controllers/order-products";

export const orders = Router();

orders.post(
  "/",
  ensureAuthenticated,
  ensureRole(["PRODUCER"]),
  orderProductsController
);
