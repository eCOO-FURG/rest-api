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
    attachments: z.array(
        z.object({
          filename: z.string().optional(),
          content: z.custom<Buffer>(),
        })
      ).optional(),
  }),
};

export async function sendNotificationController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const files = request.files as Record<string, Express.Multer.File[]>;

    const content = {
      ...request.body,
      attachments: files?.attachments?.map((file) => ({
        content: file.buffer,
      })),
    };

    const { title, message, role, attachments } = sendNotificationSchema.body.parse(
      content
    );

    const sendNotificationUseCase = container.resolve<SendNotificationUseCase>(
      "sendNotificationUseCase"
    );

    await sendNotificationUseCase.execute({ title, message, role, attachments });

    return response.status(204).send();
  } catch (error) {
    next(error);
  }
}
