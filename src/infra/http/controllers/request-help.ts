// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Container
import container from "@/infra/container";

// Use-cases
import { RequestHelpUseCase } from "@/core/use-cases/request-help";

// Validation
import { parse } from "@/infra/http/validation/parse";

export const requestHelpSchema = Joi.object({
  message: Joi.string().max(500).required(),
});

export async function requestHelpController(request: Request, response: Response, next: NextFunction) {
  try {
    const { message } = parse(requestHelpSchema, request.body);

    const requestHelpUseCase = container.resolve<RequestHelpUseCase>("requestHelpUseCase");

    await requestHelpUseCase.execute({
      content: message,
      user_id: request.user_id,
    });

    return response.sendStatus(200);
  } catch (error) {
    next(error);
  }
}
