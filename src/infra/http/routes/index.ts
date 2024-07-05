// Libs
import { Router } from "express";

// Controllers
import { registerController } from "@/infra/http/controllers/register";
import { authenticateController } from "@/infra/http/controllers/authenticate";
import { verifyUserController } from "@/infra/http/controllers/verify-user";
import { registerFarmController } from "@/infra/http/controllers/register-farm";

// Middlewares
import { ensureAuthenticated } from "@/infra/http/middlewares/ensure-authenticated";

export const router = Router();

router.post("/users", registerController);
router.post("/users/auth", authenticateController);
router.get("/users/verify", verifyUserController);

router.post("/farms", ensureAuthenticated, registerFarmController);

router.post("/orders");
