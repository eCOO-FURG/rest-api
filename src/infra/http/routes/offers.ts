// Libraries
import { Router } from "express";

// Middlewares
import { ensureRole } from "@/infra/http/middlewares/ensure-role";
import { ensureAuthenticated } from "@/infra/http/middlewares/ensure-authenticated";

// Controllers
import { deleteOfferController } from "@/infra/http/controllers/delete-offer";
import { listOffersController } from "@/infra/http/controllers/list-offers";
import { registerOfferController } from "@/infra/http/controllers/register-offer";
import { updateOfferController } from "@/infra/http/controllers/update-offer";

export const offers = Router();

offers.post("/", ensureAuthenticated, ensureRole(["PRODUCER", "MANAGER"]), registerOfferController);

offers.get("/", listOffersController);

offers.patch(
  "/:offer_id",
  ensureAuthenticated,
  ensureRole(["PRODUCER", "MANAGER"]),
  updateOfferController,
);

offers.delete(
  "/:offer_id",
  ensureAuthenticated,
  ensureRole(["PRODUCER", "MANAGER"]),
  deleteOfferController,
);
