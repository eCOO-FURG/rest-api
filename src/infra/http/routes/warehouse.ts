// Libraries
import { Router } from "express";

// Controllers
import { fetchWarehouseController } from "@/infra/http/controllers/fetch-warehouse";
import { updateWarehouseController } from "@/infra/http/controllers/update-warehouse";

// Middlewares
import { ensureAuthenticated } from "@/infra/http/middlewares/ensure-authenticated";
import { ensureRole } from "@/infra/http/middlewares/ensure-role";

export const warehouse = Router();

warehouse.get("/", fetchWarehouseController);
warehouse.patch(
  "/",
  ensureAuthenticated,
  ensureRole(["MANAGER"]),
  updateWarehouseController,
);
