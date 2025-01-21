// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Container
import container from "@/infra/container";

// Validation
import { notEmpty } from "@/infra/http/validation/not-empty";

// Use-cases
import { SendNotificationUseCase } from "@/core/use-cases/send-notification";

export const sendNotificationSchema = {
  body: z.object({
    title: z.string(),
    message: z.string(),
    role: z
      .enum(["USER", "PRODUCER"])
      .openapi({
        type: "string",
        enum: ["USER", "PRODUCER"],
      })
      .refine(notEmpty.validation, notEmpty.warning),
  }),
};

export async function sendNotificationController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { title, message, role } = sendNotificationSchema.body.parse(
      request.body
    );

    const sendNotificationUseCase = container.resolve<SendNotificationUseCase>(
      "sendNotificationUseCase"
    );

    await sendNotificationUseCase.execute({ title, message, role });

    return response.status(204).send();
  } catch (error) {
    next(error);
  }
}
