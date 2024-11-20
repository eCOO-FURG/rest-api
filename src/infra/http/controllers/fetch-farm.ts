// Container
import container from "@/infra/container";

//Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { FetchFarmUseCase } from "@/core/use-cases/fetch-farm";

// Presenters
import { FarmPresenter } from "@/infra/http/presenters/farm-presenter";

export const fetchFarmSchema = {
  params: z.object({ farm_id: z.string().uuid() }),
};

export async function fetchFarmController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const fetchUserFarmUseCase =
      container.resolve<FetchFarmUseCase>("fetchFarmUseCase");

    const { farm_id } = fetchFarmSchema.params.parse(request.params);

    const { farm } = await fetchUserFarmUseCase.execute({
      farm_id,
    });

    return response.status(200).send(FarmPresenter.toHttp(farm));
  } catch (error) {
    next(error);
  }
}
