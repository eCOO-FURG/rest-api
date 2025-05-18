// Libraries
import { Router } from "express";

// Middlewares
import { ensureAuthenticated } from "@/infra/http/middlewares/ensure-authenticated";
import { ensureRole } from "@/infra/http/middlewares/ensure-role";

// Controllers
import { listCatalogsController } from "@/infra/http/controllers/list-catalogs";
import { fetchCatalogController } from "@/infra/http/controllers/fetch-catalog";
import { fetchLastCatalogController } from "@/infra/http/controllers/fetch-last-catalog";

export const catalogs = Router();

catalogs.get("/", listCatalogsController);
catalogs.get("/last", ensureAuthenticated, ensureRole(["PRODUCER"]), fetchLastCatalogController);
catalogs.get("/:catalog_id", fetchCatalogController);
