// Libraries
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Container
import container from "@/infra/container";

// Use-cases
import { UpdateCatalogUseCase } from "@/core/use-cases/update-catalog";

// Validations
import { notEmpty } from "@/infra/http/validation/not-empty";

export const updateCatalogSchema = {
  route: z.object({
    catalog_id: z.string().uuid(),
  }),
  body: z.object({
    offers: z
      .array(
        z.object({
          id: z.string().uuid(),
          amount: z.number().optional(),
          price: z.number().optional(),
          description: z.string().optional(),
          deleted: z.boolean().optional(),
        })
      )
      .refine(notEmpty.validation, notEmpty.warning),
  }),
};

export async function updateCatalogController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { catalog_id } = updateCatalogSchema.route.parse(request.params);

    const { offers } = updateCatalogSchema.body.parse(request.body);

    const updateCatalogUseCase = container.resolve<UpdateCatalogUseCase>(
      "updateCatalogUseCase"
    );

    await updateCatalogUseCase.execute({
      farm_id: request.farm_id,
      catalog_id,
      offers,
    });

    return response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
