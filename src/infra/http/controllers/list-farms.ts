// Libraries
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { ListFarmsUseCase } from "@/core/use-cases/list-farms";

// Container
import container from "@/infra/container";

// Presenters
import { FarmPresenter } from "@/infra/http/presenters/farm-presenter";

export const listFarmsSchema = {
  query: z.object({
    page: z.coerce.number().openapi({ description: "Página da listagem." }),
    farm: z
      .string()
      .optional()
      .openapi({ description: "Filtro de nome para a busca." }),
  }),
};

export async function listFarmsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { page, farm } = listFarmsSchema.query.parse(request.query);

    const listFarmsUseCase =
      container.resolve<ListFarmsUseCase>("listFarmsUseCase");

    const { farms } = await listFarmsUseCase.execute({ page, name: farm });

    return response
      .status(200)
      .send(farms.map((farm) => FarmPresenter.toHttp(farm)));
  } catch (error) {
    next(error);
  }
}
