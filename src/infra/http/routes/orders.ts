// Libraries
import { Router } from "express";

// Middlewares
import { ensureAuthenticated } from "@/infra/http/middlewares/ensure-authenticated";
import { ensureRole } from "@/infra/http/middlewares/ensure-role";

// Controllers
import { registerOrderController } from "@/infra/http/controllers/register-order";

export const orders = Router();

orders.post("/", ensureAuthenticated, registerOrderController);
