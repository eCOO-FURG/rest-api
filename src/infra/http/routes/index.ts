// Libs
import { Router } from "express";

// Controllers
import { RegisterController } from "@/infra/http/controllers/register";
import { AuthenticateController } from "../controllers/authenticate";
import { VerifyUserController } from "../controllers/verify-user";
import { CheckFarmDeliveryController } from "../controllers/check-farm-delivery";

export const router = Router();

router.post("/users", RegisterController.handle);
router.post("/users/auth", AuthenticateController.handle);
router.get("/users/verify", VerifyUserController.handle);
router.post("/offers/check-delivery", CheckFarmDeliveryController.handle);
