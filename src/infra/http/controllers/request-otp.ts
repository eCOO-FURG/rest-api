// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Use-cases
import { RequestOtpUseCase } from "@/core/use-cases/request-otp";

// Container
import container from "@/infra/container";

// Validation
import { parse } from "@/infra/http/validation/parse";

export const requestOtpSchema = Joi.object({
  email: Joi.string().email().required(),
});

export async function requestOtpController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { email } = parse(requestOtpSchema, request.body);

    container.resolve("onOtpRequestEvent");

    const requestOtpUseCase =
      container.resolve<RequestOtpUseCase>("requestOtpUseCase");

    await requestOtpUseCase.execute({
      email,
    });

    return response.sendStatus(201);
  } catch (error) {
    next(error);
  }
}
