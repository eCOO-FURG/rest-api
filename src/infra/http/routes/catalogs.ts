// Libraries
import { Router } from "express";

// Controllers
import { listCatalogsController } from "@/infra/http/controllers/list-catalogs";
import { fetchCatalogController } from "@/infra/http/controllers/fetch-catalog";

export const catalogs = Router();

catalogs.get("/", listCatalogsController);
catalogs.get("/:catalog_id", fetchCatalogController);
