// Libs
import { Router } from "express";

// Controllers
import { RegisterController } from "@/infra/http/controllers/register";

export const router = Router();

router.post("/users", RegisterController.handle);
