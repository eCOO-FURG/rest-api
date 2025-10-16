// Libraries
import { Request, Response, NextFunction } from "express";
import Joi from "joi";

// Container
import container from "@/infra/container";

// Use-cases
import { ListMarketsUseCase } from "@/core/use-cases/list-markets";

// Presenters
import { MarketPresenter } from "@/infra/http/presenters/market-presenter";

// Validation
import { parse } from "@/infra/http/validation/parse";
import { boolean } from "@/infra/http/validation/boolean";

// Utils
import { toBoolean } from "@/infra/utils/to-boolean";

export const listMarketsQuery = Joi.object({
  page: Joi.number().integer().min(1).required(),
  name: Joi.string().optional(),
  open: boolean.optional(),
});

export async function listMarketsController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { page, name, open } = parse(listMarketsQuery, request.query);

    const listMarketsUseCase = container.resolve<ListMarketsUseCase>("listMarketsUseCase");

    const { markets } = await listMarketsUseCase.execute({
      page,
      name,
      open: toBoolean(open),
    });

    return response.status(200).send(markets.map(MarketPresenter.toHttp));
  } catch (error) {
    next(error);
  }
}
