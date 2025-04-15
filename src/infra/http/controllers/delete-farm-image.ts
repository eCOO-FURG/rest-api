import { Request, Response, NextFunction } from "express";
import Joi from "joi";

// Container
import container from "@/infra/container";

// Validation
import { parse } from "@/infra/http/validation/parse";

// Use-cases
import { DeleteFarmImageUseCase } from "@/core/use-cases/delete-farm-image";

export const deleteFarmImageParams = Joi.object({
  farm_id: Joi.string().uuid().required(),
  image_url: Joi.string().required(),
});

export async function deleteFarmImageController(request: Request, response: Response, next: NextFunction) {
  try {
    const { farm_id, image_url } = parse(deleteFarmImageParams, request.params);

    const deleteFarmImageUseCase = container.resolve<DeleteFarmImageUseCase>("deleteFarmImageUseCase");

    await deleteFarmImageUseCase.execute({
      farm_id,
      user_id: request.user_id,
      image_url: decodeURIComponent(image_url),
    });

    return response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
