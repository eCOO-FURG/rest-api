// Libraries
import { Router } from "express";

// Middlewares
import { ensureRole } from "@/infra/http/middlewares/ensure-role";

// Controllers
import { registerOfferController } from "@/infra/http/controllers/register-offer";

export const offers = Router();

offers.post("/", ensureRole(["PRODUCER"]), registerOfferController);
