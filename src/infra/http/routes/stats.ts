// Libraries
import { Router } from "express";

// Controllers
import { fetchSalesStatsController } from "@/infra/http/controllers/fetch-sales-stats";

export const stats = Router();

stats.get("/", fetchSalesStatsController);
