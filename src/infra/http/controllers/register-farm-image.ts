import { Request, Response, NextFunction } from "express";
import Joi from "joi";

// Container
import container from "@/infra/container";

// Validation
import { parse } from "@/infra/http/validation/parse";

// Use-cases
import { RegisterFarmImageUseCase } from "@/core/use-cases/register-farm-image";

// Validation
import { file } from "@/infra/http/validation/file";

// Utils
import { toFile } from "@/infra/utils/to-file";

export const registerFarmImageSchema = Joi.object({
  image: file.required(),
});

export async function registerFarmImageController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { image } = parse(registerFarmImageSchema, request.body);

    const registerFarmImageUseCase =
      container.resolve<RegisterFarmImageUseCase>("registerFarmImageUseCase");

    await registerFarmImageUseCase.execute({
      farm_id: request.farm_id,
      image: toFile(image),
    });

    return response.sendStatus(201);
  } catch (error) {
    next(error);
  }
}
