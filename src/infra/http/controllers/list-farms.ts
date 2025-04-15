// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Use-cases
import { ListFarmsUseCase } from "@/core/use-cases/list-farms";

// Container
import container from "@/infra/container";

// Presenters
import { FarmPresenter } from "@/infra/http/presenters/farm-presenter";

// Validation
import { parse } from "@/infra/http/validation/parse";

export const listFarmsQuery = Joi.object({
  page: Joi.number().required().min(1),
  farm: Joi.string().optional(),
});

export async function listFarmsController(request: Request, response: Response, next: NextFunction) {
  try {
    const { page, farm } = parse(listFarmsQuery, request.query);

    const listFarmsUseCase = container.resolve<ListFarmsUseCase>("listFarmsUseCase");

    const { farms } = await listFarmsUseCase.execute({ page, name: farm });

    return response.status(200).send(farms.map((farm) => FarmPresenter.toHttp(farm)));
  } catch (error) {
    next(error);
  }
}
