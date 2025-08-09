// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Container
import container from "@/infra/container";

// Validation
import { parse } from "@/infra/http/validation/parse";

// Use-cases
import { SendNotificationUseCase } from "@/core/use-cases/send-notification";

// Utils
import { toFile } from "@/infra/utils/to-file";

// Validation
import { files } from "@/infra/http/validation/file";

export const sendNotificationSchema = Joi.object({
  title: Joi.string().required(),
  message: Joi.string().required(),
  role: Joi.string().valid("USER", "PRODUCER").required(),
  files: files.optional(),
});

export async function sendNotificationController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { title, message, role, files } = parse(
      sendNotificationSchema,
      request.body,
    );

    const sendNotificationUseCase = container.resolve<SendNotificationUseCase>(
      "sendNotificationUseCase",
    );

    await sendNotificationUseCase.execute({
      title,
      message,
      role,
      files: toFile(files),
    });

    return response.status(204).send();
  } catch (error) {
    next(error);
  }
}
