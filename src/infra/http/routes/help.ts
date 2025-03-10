import { Router } from "express";

// Middlewares
import { ensureRole } from "@/infra/http/middlewares/ensure-role";

// Controllers
import { requestHelpController } from "@/infra/http/controllers/request-help";

export const help = Router();

help.post("/", ensureRole(["PRODUCER"]), requestHelpController);
