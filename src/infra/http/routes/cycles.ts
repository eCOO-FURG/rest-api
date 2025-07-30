// Libraries
import { Router } from "express";

// Controllers
import { listCyclesController } from "@/infra/http/controllers/list-cycles";
import { fetchCycleCatalogController } from "@/infra/http/controllers/fetch-cycle-catalog";
import { ensureAuthenticated } from "../middlewares/ensure-authenticated";
import { ensureRole } from "../middlewares/ensure-role";

export const cycles = Router();

cycles.get("/", listCyclesController);
cycles.get(
  "/:cycle_id/catalog",
  ensureAuthenticated,
  ensureRole(["PRODUCER"]),
  fetchCycleCatalogController,
);
