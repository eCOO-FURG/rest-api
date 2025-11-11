// Libraries
import { NextFunction, Request, Response } from "express";
import Joi from "joi";

// Use-cases
import { UpdateProducerUseCase } from "@/core/use-cases/update-producer";

// Container
import container from "@/infra/container";

// Validation
import { file } from "@/infra/http/validation/file";
import { parse } from "@/infra/http/validation/parse";

// Utils
import { toFile } from "@/infra/utils/to-file";

export const updateProducerSchema = Joi.object({
  first_name: Joi.string().optional(),
  last_name: Joi.string().optional(),
  cpf: Joi.string().min(11).max(11).optional(),
  phone: Joi.string().min(11).max(11).optional(),
  email: Joi.string().email().lowercase().optional(),
  name: Joi.string().optional(),
  tally: Joi.string().optional(),
  chat: Joi.string().optional(),
  photo: file.optional(),
});

export async function updateProducerController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { farm_id } = request.params;
    const { first_name, last_name, cpf, email, phone, name, tally, chat, photo } = parse(
      updateProducerSchema,
      request.body,
    );

    const updateProducerUseCase = container.resolve<UpdateProducerUseCase>("updateProducerUseCase");

    await updateProducerUseCase.execute({
      farm_id,
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

    return response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
