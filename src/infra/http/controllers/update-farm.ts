// Use-cases
import { UpdateFarmUseCase } from "@/core/use-cases/update-farm";

// Container
import container from "@/infra/container";

// Libraries
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// Validation
import { notEmpty } from "@/infra/http/validation/not-empty";

// Utils
import { toFile } from "@/infra/utils/to-file";
import { toArray } from "@/infra/utils/to-array";

export const updateFarmSchema = {
  body: z
    .object({
      name: z.string().optional(),
      tally: z.string().optional(),
      description: z.string().optional(),
      photo: z.custom<Express.Multer.File>().optional(),
      add_images: z.custom<Express.Multer.File[]>().optional(),
      remove_images: z.array(z.string()).optional().or(z.string().optional()),
    })
    .refine(notEmpty.validation, notEmpty.warning),
};

export async function updateFarmController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { name, tally, description, photo, add_images, remove_images } =
      updateFarmSchema.body.parse(request.body);

    const updateFarmUseCase =
      container.resolve<UpdateFarmUseCase>("updateFarmUseCase");

    await updateFarmUseCase.execute({
      farm_id: request.farm_id,
      name,
      tally,
      description,
      photo: toFile(photo),
      images: { add: toFile(add_images), remove: toArray(remove_images) },
    });

    return response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
