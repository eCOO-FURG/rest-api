// Libraries
import { NextFunction, Request, Response } from "express";
import Joi from "joi";

// Container
import container from "@/infra/container";

// Use-cases
import { FetchCategoryUseCase } from "@/core/use-cases/fetch-category";

// Validation
import { parse } from "@/infra/http/validation/parse";

// Presenters
import { CategoryPresenter } from "@/infra/http/presenters/category-presenter";

// Utils
import { toDate } from "@/infra/utils/to-date";

// Entities
import { Bag } from "@/core/entities/bag";

export const fetchCategoryParams = Joi.object({
  category_id: Joi.string().uuid().required(),
});

export const fetchCategoryQuery = Joi.object({
  page: Joi.number().required().min(1),
  cycle_id: Joi.string().uuid().optional(),
  available: Joi.string()
    .valid(...Bag.sources, "false")
    .optional(),
  since: Joi.string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "DD-MM-YYYY")
    .optional(),
  before: Joi.string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "DD-MM-YYYY")
    .optional(),
});

export async function fetchCategoryController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { category_id } = parse(fetchCategoryParams, request.params);

    const { page, cycle_id, available, since, before } = parse(fetchCategoryQuery, request.query);

    const fetchCategoryUseCase = container.resolve<FetchCategoryUseCase>("fetchCategoryUseCase");

    const { category } = await fetchCategoryUseCase.execute({
      category_id,
      page,
      cycle_id,
      available: available === "false" ? false : available,
      since: toDate(since),
      before: toDate(before),
    });

    return response.status(200).send(CategoryPresenter.toHttp(category));
  } catch (error) {
    next(error);
  }
}
