// Container
import container from "@/infra/container";

//Libs
import { NextFunction, Request, Response } from "express";

// Use-cases
import { FetchUserFarmUseCase } from "@/core/use-cases/fetch-user-farm";

// Presenters
import { FarmPresenter } from "@/infra/http/presenters/farm-presenter";

export async function fetchUserFarmController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const fetchUserFarmUseCase = container.resolve<FetchUserFarmUseCase>(
      "fetchUserFarmUseCase"
    );

    const farm_id = request.farm_id;

    const { farm } = await fetchUserFarmUseCase.execute({
      farm_id
    });

    return response.status(200).send(FarmPresenter.toHttp(farm));
  } catch (error) {
    next(error);
  }
}