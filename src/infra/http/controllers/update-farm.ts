// Use-cases
import { UpdateFarmUseCase } from "@/core/use-cases/update-farm";

// Container
import container from "@/infra/container";

// Libs
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// Validation
import { notEmpty } from "@/infra/http/validation/not-empty";

// Utils
import { toBuffer } from "@/infra/utils/to-buffer";

export const updateFarmSchema = {
  body: z
    .object({
      name: z.string().optional(),
      tally: z.string().optional(),
      description: z.string().optional(),
      photo: z.custom<Buffer>().optional(),
      images: z.array(z.union([z.string(), z.custom<Buffer>()])).optional(),
    })
    .refine(notEmpty.validation, notEmpty.warning),
};

export async function updateFarmController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const files = request.files as Record<string, Express.Multer.File[]>;

    const content = {
      ...request.body,
      photo: files?.photo?.at(0)?.buffer,
      images: toBuffer(files?.images).concat(request.body.images ?? []),
    };

    const { name, tally, description, images, photo } =
      updateFarmSchema.body.parse(content);

    const updateFarmUseCase =
      container.resolve<UpdateFarmUseCase>("updateFarmUseCase");

    await updateFarmUseCase.execute({
      farm_id: request.farm_id,
      name,
      tally,
      description,
      photo,
      images,
    });

    return response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
