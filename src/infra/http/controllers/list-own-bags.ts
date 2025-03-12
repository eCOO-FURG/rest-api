// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Container
import container from "@/infra/container";

// Use-cases
import { ListBagsUseCase } from "@/core/use-cases/list-bags";

// Presenters
import { BagPresenter } from "@/infra/http/presenters/bag-presenter";

// Utils
import { toDate } from "@/infra/utils/to-date";

// Validation
import { parse } from "@/infra/http/validation/parse";

// Utils
import { toArray } from "@/infra/utils/to-array";

// Entities
import { Bag } from "@/core/entities/bag";

export const listOwnBagsQuery = Joi.object({
  page: Joi.number().required(),
  cycle_id: Joi.string().uuid().optional(),
  statuses: Joi.alternatives()
    .try(
      Joi.string().valid(...Bag.statuses),
      Joi.array().items(Joi.string().valid(...Bag.statuses))
    )
    .optional(),
  since: Joi.string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "DD-MM-YYYY")
    .optional(),
  before: Joi.string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "DD-MM-YYYY")
    .optional(),
});

export async function listOwnBagsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { page, since, before, statuses, cycle_id } = parse(
      listOwnBagsQuery,
      request.query
    );

    const listBagsUseCase =
      container.resolve<ListBagsUseCase>("listBagsUseCase");

    const { bags } = await listBagsUseCase.execute({
      user_id: request.user_id,
      cycle_id,
      statuses: toArray(statuses),
      since: toDate(since),
      before: toDate(before),
      page,
    });

    return response
      .status(200)
      .send(bags.map((bag) => BagPresenter.toHttp(bag)));
  } catch (error) {
    next(error);
  }
}
