// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Container
import container from "@/infra/container";

// Use-cases
import { ListFarmsUseCase } from "@/core/use-cases/list-farms";

// Presenters
import { FarmAggregatePresenter } from "@/infra/http/presenters/farm-aggregate-presenter";

const listFarmsSchema = {
  query: z.object({
    page: z.coerce.number(),
    name: z.string().optional(),
  }),
};

export async function listFarmsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { page, name } = listFarmsSchema.query.parse(request.query);

    const listFarmsUseCase =
      container.resolve<ListFarmsUseCase>("listFarmsUseCase");

    const { farms } = await listFarmsUseCase.execute({ page, name });

    return response
      .status(200)
      .send(farms.map((farm) => FarmAggregatePresenter.toHttp(farm)));
  } catch (error) {
    next(error);
  }
}
