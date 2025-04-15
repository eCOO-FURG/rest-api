// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Use-cases
import { RegisterUseCase } from "@/core/use-cases/register";

// Container
import container from "@/infra/container";

// Validation
import { parse } from "@/infra/http/validation/parse";

export const registerSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  cpf: Joi.string().min(11).max(11).required(),
  phone: Joi.string().required().min(11).max(11),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).optional(),
  role: Joi.string().valid("USER", "PRODUCER").required(),
  chat: Joi.string().optional(),
});

export async function registerController(request: Request, response: Response, next: NextFunction) {
  try {
    const { first_name, last_name, cpf, email, phone, password, chat, role } = parse(registerSchema, request.body);

    const registerUseCase = container.resolve<RegisterUseCase>("registerUsecase");

    await registerUseCase.execute({
      first_name,
      last_name,
      cpf,
      email,
      phone,
      password,
      chat,
      role,
    });

    return response.sendStatus(201);
  } catch (error) {
    next(error);
  }
}
