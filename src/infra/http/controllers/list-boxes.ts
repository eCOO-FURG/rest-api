// Use-cases
import Joi from "joi";
import { ListBoxesUseCase } from "@/core/use-cases/list-boxes";

// Container
import container from "@/infra/container";

// Libraries
import { Request, Response, NextFunction } from "express";

// Presenters
import { BoxPresenter } from "@/infra/http/presenters/box-presenter";

// Validation
import { parse } from "@/infra/http/validation/parse";

export const listBoxesQuery = Joi.object({
  cycle_id: Joi.string().uuid().required(),
  page: Joi.number().required().min(1),
  farm: Joi.string().optional(),
});

export async function listBoxesController(request: Request, response: Response, next: NextFunction) {
  try {
    const { cycle_id, page, farm } = parse(listBoxesQuery, request.query);

    const listBoxesUseCase = container.resolve<ListBoxesUseCase>("listBoxesUseCase");

    const { boxes } = await listBoxesUseCase.execute({
      cycle_id,
      page,
      farm,
    });

    return response.status(200).send(boxes.map((farm) => BoxPresenter.toHttp(farm)));
  } catch (error) {
    next(error);
  }
}
