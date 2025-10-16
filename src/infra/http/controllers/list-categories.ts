// Libraries
import { NextFunction, Request, Response } from "express";
import Joi from "joi";

// Container
import container from "@/infra/container";

// Use-cases
import { ListCategoriesUseCase } from "@/core/use-cases/list-categories";

// Presenters
import { CategoryPresenter } from "@/infra/http/presenters/category-presenter";

// Validation
import { boolean } from "@/infra/http/validation/boolean";
import { parse } from "@/infra/http/validation/parse";

// Utils
import { toBoolean } from "@/infra/utils/to-boolean";
import { toDate } from "@/infra/utils/to-date";

export const listCategoriesQuery = Joi.object({
  page: Joi.number().required().min(1),
  name: Joi.string().optional(),
  cycle_id: Joi.string().uuid().optional(),
  available: boolean.optional(),
  since: Joi.string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "DD-MM-YYYY")
    .optional(),
  before: Joi.string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "DD-MM-YYYY")
    .optional(),
});

export async function listCategoriesController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { page, name, cycle_id, available, since, before } = parse(
      listCategoriesQuery,
      request.query,
    );

    const listCategoriesUseCase = container.resolve<ListCategoriesUseCase>("listCategoriesUseCase");

    const { categories } = await listCategoriesUseCase.execute({
      name,
      page,
      cycle_id,
      available: toBoolean(available),
      since: toDate(since),
      before: toDate(before),
    });

    return response
      .status(200)
      .send(categories.map((category) => CategoryPresenter.toHttp(category)));
  } catch (error) {
    next(error);
  }
}
