// Libraries
import { Router } from "express";

// Middlewares
import { ensureAuthenticated } from "@/infra/http/middlewares/ensure-authenticated";
import { ensureRole } from "@/infra/http/middlewares/ensure-role";

// Controllers
import { listCurrentBagsController } from "@/infra/http/controllers/list-current-bags";
import { listBagsController } from "@/infra/http/controllers/list-bags";
import { fetchBagController } from "@/infra/http/controllers/fetch-bag";
import { updateBagController } from "@/infra/http/controllers/update-bag";

export const bags = Router();

bags.get("/", listBagsController);
bags.get("/current", ensureRole(["BROKER"]), listCurrentBagsController);
bags.get("/:bag_id", fetchBagController);

bags.patch("/:bag_id", ensureRole(["BROKER"]), ensureAuthenticated, updateBagController);
