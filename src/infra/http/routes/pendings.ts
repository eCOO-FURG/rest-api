// Libraries
import { Router } from "express";

// Controllers
import { fetchPendingsController } from "@/infra/http/controllers/fetch-pendings";

export const pendings = Router();

pendings.get("/", fetchPendingsController);
