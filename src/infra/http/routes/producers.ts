// Libraries
import { Router } from "express";

// Middlewares
import { processFiles } from "@/infra/http/middlewares/process-files";

// Controllers
import { registerProducerController } from "@/infra/http/controllers/register-producer";
import { updateProducerController } from "@/infra/http/controllers/update-producer";

export const producers = Router();

producers.post(
  "/",
  processFiles([
    {
      name: "photo",
      options: { allowed: ["image/jpeg", "image/png"], size: 1 },
    },
  ]),
  registerProducerController,
);

producers.patch(
  "/:farm_id",
  processFiles([
    {
      name: "photo",
      options: { allowed: ["image/jpeg", "image/png"], size: 1 },
    },
  ]),
  updateProducerController,
);
