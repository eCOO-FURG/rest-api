// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { RegisterUseCase } from "@/core/use-cases/register";

// Container
import container from "@/infra/container";

export const registerSchema = {
  body: z.object({
    first_name: z.string(),
    last_name: z.string(),
    cpf: z.string().max(14),
    email: z.string().email(),
    phone: z.string(),
    password: z.string().min(8).optional(),
  }),
};

export async function registerController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { first_name, last_name, cpf, email, phone, password } =
      registerSchema.body.parse(request.body);

    container.resolve("onRegisteredEvent");

    const registerUseCase =
      container.resolve<RegisterUseCase>("registerUsecase");

    await registerUseCase.execute({
      first_name,
      last_name,
      cpf,
      email,
      phone,
      password,
    });

    return response.sendStatus(201);
  } catch (error) {
    next(error);
  }
}
