// Libraries
import { Router } from "express";

// Controllers
import { listCategoriesController } from "@/infra/http/controllers/list-categories";

export const categories = Router();

categories.get("/", listCategoriesController);
