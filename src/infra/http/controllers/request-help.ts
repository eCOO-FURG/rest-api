// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Container
import container from "@/infra/container";

// Use-cases
import { RequestHelpUseCase } from "@/core/use-cases/request-help";

export const requestHelpSchema = {
  body: z.object({ content: z.string().max(500) }),
};

export async function requestHelpController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { content } = requestHelpSchema.body.parse(request.body);

    const user_id = request.user_id;

    container.resolve("onRequestHelpEvent");

    const requestHelpUseCase =
      container.resolve<RequestHelpUseCase>(
        "requestHelpUseCase"
      );

    await requestHelpUseCase.execute({
      content,
      user_id
    });

    return response.sendStatus(200);
  } catch (error) {
    next(error);
  }
}