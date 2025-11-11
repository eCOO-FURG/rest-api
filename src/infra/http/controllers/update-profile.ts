// Use-cases
import Joi from "joi";
import { UpdateUserUseCase } from "@/core/use-cases/update-user";

// Container
import container from "@/infra/container";

// Libraries
import { Request, Response, NextFunction } from "express";

// Validation
import { parse } from "@/infra/http/validation/parse";

// Utils
import { toFile } from "@/infra/utils/to-file";

// Validation
import { file } from "@/infra/http/validation/file";

export const updateProfileSchema = Joi.object({
  first_name: Joi.string().optional(),
  last_name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  cpf: Joi.string().min(11).max(11).optional(),
  phone: Joi.string().min(11).max(11).optional(),
  password: Joi.string().min(8).optional(),
  chat: Joi.string().optional(),
  photo: file.optional(),
});

export async function updateProfileController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { first_name, last_name, email, cpf, phone, password, photo, chat } = parse(
      updateProfileSchema,
      request.body,
    );

    const updateUserUsecase = container.resolve<UpdateUserUseCase>("updateUserUseCase");

    await updateUserUsecase.execute({
      user_id: request.user_id,
      first_name,
      last_name,
      cpf,
      email,
      password,
      phone,
      chat,
      photo: toFile(photo),
    });

    return response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
