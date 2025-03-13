// Libraries
import { Router } from "express";

// Middlewares
import { ensureRole } from "@/infra/http/middlewares/ensure-role";

// Controllers
import { registerOfferController } from "@/infra/http/controllers/register-offer";
import { deleteOfferController } from "@/infra/http/controllers/delete-offer";
export const offers = Router();

offers.post("/", ensureRole(["PRODUCER"]), registerOfferController);

offers.delete("/:offer_id", ensureRole(["PRODUCER"]), deleteOfferController);
