// Libraries
import { Router } from "express";

// Controllers
import { listMarketsController } from "@/infra/http/controllers/list-markets";
import { fetchMarketController } from "@/infra/http/controllers/fetch-market";
import { registerMarketController } from "@/infra/http/controllers/register-market";
import { updateMarketController } from "@/infra/http/controllers/update-market";

// Middlewares
import { ensureAuthenticated } from "@/infra/http/middlewares/ensure-authenticated";
import { ensureRole } from "@/infra/http/middlewares/ensure-role";

export const markets = Router();

markets.get("/", listMarketsController);
markets.get("/:market_id", fetchMarketController);

markets.post("/", ensureAuthenticated, ensureRole(["BROKER", "MANAGER"]), registerMarketController);

markets.patch(
  "/:market_id",
  ensureAuthenticated,
  ensureRole(["BROKER", "MANAGER"]),
  updateMarketController,
);
