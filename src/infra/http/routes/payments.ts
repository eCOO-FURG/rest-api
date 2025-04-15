// Libraries
import { Router } from "express";

// Middlewares
import { ensureAuthenticated } from "@/infra/http/middlewares/ensure-authenticated";
import { ensureRole } from "@/infra/http/middlewares/ensure-role";

// Controllers
import { registerPaymentController } from "@/infra/http/controllers/register-payment";
import { updatePaymentController } from "@/infra/http/controllers/update-payment";
import { openPaymentController } from "@/infra/http/controllers/open-payment";

export const payments = Router();

payments.post("/", ensureRole(["MANAGER"]), registerPaymentController);
payments.post("/open", ensureRole(["MANAGER"]), openPaymentController);

payments.patch("/:payment_id", ensureRole(["MANAGER"]), updatePaymentController);
