// Libraries
import { Router } from "express";

// Controllers
import { registerController } from "@/infra/http/controllers/register";
import { listUsersController } from "@/infra/http/controllers/list-users";
import { updateUserController } from "@/infra/http/controllers/update-user";

// Middlewares
import { ensureAuthenticated } from "@/infra/http/middlewares/ensure-authenticated";
import { ensureRole } from "@/infra/http/middlewares/ensure-role";
import { processFiles } from "@/infra/http/middlewares/process-files";

export const users = Router();

users.get("/", ensureAuthenticated, listUsersController);
users.post(
  "/",
  processFiles([
    {
      name: "photo",
      options: { allowed: ["image/jpeg", "image/png"], size: 1 },
    },
  ]),
  registerController,
);
users.patch(
  "/:user_id",
  ensureAuthenticated,
  ensureRole(["MANAGER"]),
  updateUserController,
);
