// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Use-cases
import { FetchSalesStatsUseCase } from "@/core/use-cases/fetch-sales-stats";

// Container
import container from "@/infra/container";

// Utils
import { toDate } from "@/infra/utils/to-date";

// Validation
import { parse } from "@/infra/http/validation/parse";

export const fetchSalesStatsQuery = Joi.object({
  since: Joi.string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "DD-MM-YYYY")
    .optional(),
  before: Joi.string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "DD-MM-YYYY")
    .optional(),
  method: Joi.string().valid("CREDIT", "DEBIT", "CASH", "PIX").optional(),
});

export async function fetchSalesStatsController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { since, before, method } = parse(fetchSalesStatsQuery, request.query);

    const fetchSalesStatsUseCase =
      container.resolve<FetchSalesStatsUseCase>("fetchSalesStatsUseCase");

    const stats = await fetchSalesStatsUseCase.execute({
      since: toDate(since),
      before: toDate(before),
      method,
    });

    return response.status(200).json(stats);
  } catch (error) {
    next(error);
  }
}
