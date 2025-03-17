// Libraries
import { Router } from "express";

// Controllers
import { authenticateController } from "@/infra/http/controllers/authenticate";
import { requestOtpController } from "@/infra/http/controllers/request-otp";
import { resetPasswordController } from "@/infra/http/controllers/reset-password";
import { verifyUserController } from "@/infra/http/controllers/verify-user";

export const auth = Router();

auth.get("/verify", verifyUserController);

auth.post("/", authenticateController);
auth.post("/otp", requestOtpController);
auth.post("/password", resetPasswordController);
