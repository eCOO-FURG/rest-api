import { Router } from "express";
import { RegisterController } from "@/infra/http/controllers/register";

export const router = Router();

router.post("/users", RegisterController.handle);
