// Libraries
import { Router } from "express";

// Middlewares
import { ensureRole } from "@/infra/http/middlewares/ensure-role";

// Controllers
import { listBoxesController } from "@/infra/http/controllers/list-boxes";
import { fetchBoxController } from "@/infra/http/controllers/fetch-box";
import { fetchCurrentBoxController } from "@/infra/http/controllers/fetch-current-box";

export const boxes = Router();

boxes.get("/", ensureRole(["BROKER"]), listBoxesController);
boxes.get("/current", ensureRole(["PRODUCER"]), fetchCurrentBoxController);
boxes.get("/:box_id", ensureRole(["BROKER"]), fetchBoxController);
