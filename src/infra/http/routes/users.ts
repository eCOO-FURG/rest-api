// Libraries
import { Router } from "express";

// Controllers
import { registerController } from "@/infra/http/controllers/register";
import { listUsersController } from "@/infra/http/controllers/list-users";

export const users = Router();

users.post("/", registerController);
users.get("/", listUsersController);
