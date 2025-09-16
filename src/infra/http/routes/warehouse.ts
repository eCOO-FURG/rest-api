// Libraries
import { Router } from "express";

// Controllers
import { fetchWarehouseController } from "@/infra/http/controllers/fetch-warehouse";

export const warehouse = Router();

warehouse.get("/", fetchWarehouseController);
