// Libraries
import { Router } from "express";

// Controllers
import { registerController } from "@/infra/http/controllers/register";

export const users = Router();

users.post("/", registerController);
