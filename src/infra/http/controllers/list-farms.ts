// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { ListFarmsUseCase } from "@/core/use-cases/list-farms";

// Container
import container from "@/infra/container";

// Presenters
import { FarmPresenter } from "../presenters/farm-presenter";

const listFarmsSchema = {
  query: z.object({
    page: z.coerce.number(),
    farm: z.string().optional(),
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

    const { farms } = await listFarmsUseCase.execute({ page, farm });

    return response
      .status(200)
      .send(farms.map((farm) => FarmPresenter.toHttp(farm)));
  } catch (error) {
    next(error);
  }
}
