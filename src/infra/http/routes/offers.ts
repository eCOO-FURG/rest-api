// Libraries
import { Router } from "express";

// Middlewares
import { ensureRole } from "@/infra/http/middlewares/ensure-role";

// Controllers
import { deleteOfferController } from "@/infra/http/controllers/delete-offer";
import { listOffersController } from "@/infra/http/controllers/list-offers";
import { registerOfferController } from "@/infra/http/controllers/register-offer";
import { updateOfferController } from "@/infra/http/controllers/update-offer";

export const offers = Router();

offers.post("/", ensureRole(["PRODUCER"]), registerOfferController);

offers.get("/", listOffersController);

offers.patch("/:offer_id", ensureRole(["PRODUCER"]), updateOfferController);

offers.delete("/:offer_id", ensureRole(["PRODUCER"]), deleteOfferController);
