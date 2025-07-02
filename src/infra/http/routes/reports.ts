// Libraries
import { Router } from "express";

// Controllers
import { fetchSalesReportController } from "@/infra/http/controllers/fetch-sales-report";
import { fetchInboundReportController } from "@/infra/http/controllers/fetch-inbound-report";
import { fetchOffersReportController } from "@/infra/http/controllers/fetch-offers-report";

export const reports = Router();

reports.get("/sales", fetchSalesReportController);
reports.get("/inbound", fetchInboundReportController);
reports.get("/offers", fetchOffersReportController);
