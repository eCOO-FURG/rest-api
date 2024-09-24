// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Container
import container from "@/infra/container";

// Use-cases
import { FetchCurrentBoxUseCase } from "@/core/use-cases/fetch-current-box";

// Presenters
import { BoxPresenter } from "@/infra/http/presenters/box-presenter";
import { OrderPresenter } from "@/infra/http/presenters/order-presenter";

export const fetchCurrentBoxSchema = {
  query: z.object({
    cycle_id: z.string().uuid(),
  }),
};

export async function fetchCurrentBoxController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { cycle_id } = fetchCurrentBoxSchema.query.parse(request.query);

    const fetchCurrentBoxUsecase = container.resolve<FetchCurrentBoxUseCase>(
      "fetchCurrentBoxUseCase"
    );

    const { box } = await fetchCurrentBoxUsecase.execute({
      farm_id: request.farm_id,
      cycle_id,
    });

    return response.status(200).send({
      ...BoxPresenter.toHttp(box),
      orders: box.orders.map((order) => OrderPresenter.toHttp(order)),
    });
  } catch (error) {
    next(error);
  }
}
