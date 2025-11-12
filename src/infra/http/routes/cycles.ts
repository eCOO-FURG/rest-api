// Libraries
import { Router } from "express";

// Controllers
import { listCyclesController } from "@/infra/http/controllers/list-cycles";
import { publishCycleOnMarketController } from "../controllers/publish-cycle-on-market";

// Middlewares
import { ensureAuthenticated } from "@/infra/http/middlewares/ensure-authenticated";
import { ensureRole } from "@/infra/http/middlewares/ensure-role";

export const cycles = Router();

cycles.get("/", listCyclesController);

cycles.post(
  "/publish",
  ensureAuthenticated,
  ensureRole(["MANAGER"]),
  publishCycleOnMarketController,
);
