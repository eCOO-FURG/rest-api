// Libraries
import { NextFunction, Request, Response } from "express";

// Use-cases
import { FetchSalesStatsUseCase } from "@/core/use-cases/fetch-sales-stats";

// Container
import container from "@/infra/container";

export async function fetchSalesStatsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const fetchSalesStatsUseCase = container.resolve<FetchSalesStatsUseCase>(
      "fetchSalesStatsUseCase"
    );

    const stats = await fetchSalesStatsUseCase.execute();

    return response.status(200).json(stats);
  } catch (error) {
    next(error);
  }
}
