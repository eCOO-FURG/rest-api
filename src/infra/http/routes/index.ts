// Libs
import { Router } from "express";

// Controllers
import { RegisterController } from "@/infra/http/controllers/register";
import { AuthenticateController } from "@/infra/http/controllers/authenticate";
import { VerifyUserController } from "@/infra/http/controllers/verify-user";

export const router = Router();

router.post("/users", RegisterController.handle);
router.post("/users/auth", AuthenticateController.handle);
router.get("/users/verify", VerifyUserController.handle);
