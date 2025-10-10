// Libraries
import { NextFunction, Request, Response } from "express";
import Joi from "joi";

// Use-cases
import { RegisterProducerUseCase } from "@/core/use-cases/register-producer";

// Container
import container from "@/infra/container";

// Validation
import { file } from "@/infra/http/validation/file";
import { parse } from "@/infra/http/validation/parse";

// Utils
import { toFile } from "@/infra/utils/to-file";

export const registerProducerSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  cpf: Joi.string().min(11).max(11).required(),
  phone: Joi.string().required().min(11).max(11),
  email: Joi.string().email().lowercase().required(),
  name: Joi.string().required(),
  tally: Joi.string().required(),
  chat: Joi.string().optional(),
  photo: file.optional(),
});

export async function registerProducerController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const {
      first_name,
      last_name,
      cpf,
      email,
      phone,
      name,
      tally,
      chat,
      photo,
    } = parse(registerProducerSchema, request.body);

    const registerProducerUseCase = container.resolve<RegisterProducerUseCase>(
      "registerProducerUseCase",
    );

    await registerProducerUseCase.execute({
      first_name,
      last_name,
      cpf,
      email,
      phone,
      name,
      tally,
      chat,
      photo: toFile(photo),
    });

    return response.sendStatus(201);
  } catch (error) {
    next(error);
  }
}
