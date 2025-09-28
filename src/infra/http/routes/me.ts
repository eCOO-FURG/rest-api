import { Router } from "express";

// Middlewares
import { processFiles } from "@/infra/http/middlewares/process-files";

// Controllers
import { fetchProfileController } from "@/infra/http/controllers/fetch-profile";
import { updateProfileController } from "@/infra/http/controllers/update-profile";

export const me = Router();

me.get("/", fetchProfileController);
me.patch(
  "/",
  processFiles([
    {
      name: "photo",
      options: { allowed: ["image/jpeg", "image/png"], size: 1 },
    },
  ]),
  updateProfileController,
);
