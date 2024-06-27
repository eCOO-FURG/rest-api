// Libs
import { Router } from "express";

// Controllers
import { RegisterController } from "@/infra/http/controllers/register";
import { AuthenticateController } from "../controllers/authenticate";

export const router = Router();

router.post("/users", RegisterController.handle);
router.post("/users/auth", AuthenticateController.handle);
