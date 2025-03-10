import { Router } from "express";

// Controllers
import { requestHelpController } from "@/infra/http/controllers/request-help";

export const help = Router();

help.get("/", requestHelpController);
