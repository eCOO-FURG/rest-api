// Libraries
import { Router } from "express";

// Controllers
import { fetchSalesReportController } from "@/infra/http/controllers/fetch-sales-report";
import { fetchInboundReportController } from "@/infra/http/controllers/fetch-inbound-report";

export const reports = Router();

reports.get("/sales", fetchSalesReportController);
reports.get("/inbound", fetchInboundReportController);
