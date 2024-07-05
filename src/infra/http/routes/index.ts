// Libs
import { Router } from "express";

// Controllers
import { RegisterController } from "@/infra/http/controllers/register";
import { AuthenticateController } from "@/infra/http/controllers/authenticate";
import { VerifyUserController } from "@/infra/http/controllers/verify-user";
import { RegisterFarmController } from "../controllers/register-farm";
import { ensureAuthenticated } from "../middlewares/ensure-authenticated";

export const router = Router();

router.post("/users", RegisterController.handle);
router.post("/users/auth", AuthenticateController.handle);
router.get("/users/verify", VerifyUserController.handle);

router.post("/farms", ensureAuthenticated, RegisterFarmController.handle);
