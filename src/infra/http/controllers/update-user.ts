// Use-cases
import { UpdateUserUseCase } from "@/core/use-cases/update-user";

// Container
import container from "@/infra/container";

// Libraries
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// Validation
import { notEmpty } from "@/infra/http/validation/not-empty";

// Utils
import { toFile } from "@/infra/utils/to-file";

export const updateUserSchema = {
  body: z
    .object({
      first_name: z.string().optional(),
      last_name: z.string().optional(),
      email: z.string().email().optional(),
      cpf: z.string().min(11).max(14).optional(),
      phone: z.string().optional(),
      password: z.string().min(8).optional(),
      chat: z.string().optional(),
      photo: z.custom<Express.Multer.File>().optional(),
    })
    .refine(notEmpty.validation, notEmpty.warning),
};

export async function updateUserController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { first_name, last_name, email, cpf, phone, password, photo, chat } =
      updateUserSchema.body.parse(request.body);

    const updateUserUsecase =
      container.resolve<UpdateUserUseCase>("updateUserUseCase");

    await updateUserUsecase.execute({
      user_id: request.user_id,
      first_name,
      last_name,
      cpf,
      email,
      password,
      phone,
      photo: toFile(photo),
      chat
    });

    return response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
