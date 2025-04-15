// Libraries
import { Router } from "express";

// Middlewares
import { processFiles } from "@/infra/http/middlewares/process-files";

// Controllers
import { sendNotificationController } from "@/infra/http/controllers/send-notification";

export const notifications = Router();

notifications.post(
  "/",
  processFiles([
    {
      name: "files",
      options: {
        allowed: ["application/pdf", "image/jpeg", "image/png"],
        size: 5,
        max: 5,
      },
    },
  ]),
  sendNotificationController,
);
