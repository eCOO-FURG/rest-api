// Libraries
import { Router } from "express";

// Controllers
import { listCyclesController } from "@/infra/http/controllers/list-cycles";

export const cycles = Router();

cycles.get("/", listCyclesController);
