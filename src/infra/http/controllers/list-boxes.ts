// Use-cases
import Joi from "joi";
import { ListBoxesUseCase } from "@/core/use-cases/list-boxes";

// Container
import container from "@/infra/container";

// Libraries
import { Request, Response, NextFunction } from "express";

// Presenters
import { BoxPresenter } from "@/infra/http/presenters/box-presenter";

// Utils
import { toDate } from "@/infra/utils/to-date";

// Validation
import { parse } from "@/infra/http/validation/parse";

export const listBoxesQuery = Joi.object({
  cycle_id: Joi.string().uuid().required(),
  page: Joi.number().required().min(1),
  farm: Joi.string().optional(),
  since: Joi.string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "DD-MM-YYYY")
    .optional(),
  before: Joi.string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "DD-MM-YYYY")
    .optional(),
});

export async function listBoxesController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { cycle_id, page, farm, since, before } = parse(listBoxesQuery, request.query);

    const listBoxesUseCase = container.resolve<ListBoxesUseCase>("listBoxesUseCase");

    const { boxes } = await listBoxesUseCase.execute({
      cycle_id,
      page,
      farm,
      since: toDate(since),
      before: toDate(before),
    });

    return response.status(200).send(boxes.map((farm) => BoxPresenter.toHttp(farm)));
  } catch (error) {
    next(error);
  }
}
