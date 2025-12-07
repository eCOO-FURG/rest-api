// Libraries
import { Router } from "express";

// Middlewares
import { ensureRole } from "@/infra/http/middlewares/ensure-role";

// Controllers
import { registerOrderController } from "@/infra/http/controllers/register-order";
import { updateOrderController } from "@/infra/http/controllers/update-order";

export const orders = Router();

orders.post("/", registerOrderController);

orders.patch("/:order_id", ensureRole(["BROKER", "MANAGER"]), updateOrderController);
