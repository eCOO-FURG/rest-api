// Libraries
import { Router } from "express";

// Controllers
import { listCategoriesController } from "@/infra/http/controllers/list-categories";
import { fetchCategoryController } from "@/infra/http/controllers/fetch-category";
export const categories = Router();

categories.get("/", listCategoriesController);
categories.get("/:category_id", fetchCategoryController);
