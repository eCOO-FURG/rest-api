// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Container
import container from "@/infra/container";

// Use-cases
import { FetchMarketUseCase } from "@/core/use-cases/fetch-market";

// Presenters
import { MarketPresenter } from "@/infra/http/presenters/market-presenter";

// Validation
import { parse } from "@/infra/http/validation/parse";

export const fetchMarketParams = Joi.object({
  market_id: Joi.string().uuid().required(),
});

export async function fetchMarketController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { market_id } = parse(fetchMarketParams, request.params);

    const fetchMarketUseCase = container.resolve<FetchMarketUseCase>("fetchMarketUseCase");

    const { market } = await fetchMarketUseCase.execute({
      market_id,
    });

    return response.status(200).send(MarketPresenter.toHttp(market));
  } catch (error) {
    next(error);
  }
}
