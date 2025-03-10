// Libraries
import { Router } from "express";

// Middlewares
import { ensureRole } from "@/infra/http/middlewares/ensure-role";

// Controllers
import { createOfferController } from "@/infra/http/controllers/create-offer";

export const offers = Router();

offers.post("/", ensureRole(["PRODUCER"]), createOfferController);
