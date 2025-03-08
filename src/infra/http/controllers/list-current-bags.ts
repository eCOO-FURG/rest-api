// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Container
import container from "@/infra/container";

// Use-cases
import { ListCurrentBagsUseCase } from "@/core/use-cases/list-current-bags";

// Presenters
import { BagPresenter } from "@/infra/http/presenters/bag-presenter";

// Validation
import { toArray } from "@/infra/utils/to-array";

// Entities
import { Bag } from "@/core/entities/bag";

// Validation
import { parse } from "@/infra/http/validation/parse";

export const listCurrentBagsQuery = Joi.object({
  page: Joi.number().required(),
  cycle_id: Joi.string().uuid().required(),
  user: Joi.string().optional(),
  statuses: Joi.alternatives()
    .try(
      Joi.string().valid(...Bag.statuses),
      Joi.array().items(Joi.string().valid(...Bag.statuses))
    )
    .optional(),
});

export async function listCurrentBagsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { cycle_id, page, user, statuses } = parse(
      listCurrentBagsQuery,
      request.query
    );

    const listCurrentBagsUseCase = container.resolve<ListCurrentBagsUseCase>(
      "listCurrentBagsUseCase"
    );

    const { bags } = await listCurrentBagsUseCase.execute({
      cycle_id,
      page,
      user,
      statuses: toArray(statuses),
    });

    return response
      .status(200)
      .send(bags.map((bag) => BagPresenter.toHttp(bag)));
  } catch (error) {
    next(error);
  }
}
