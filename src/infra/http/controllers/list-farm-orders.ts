// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Container
import container from "@/infra/container";

// Use-cases
import { ListFarmOrdersUseCase } from "@/core/use-cases/list-farm-orders";

// Presenters
import { FarmPresenter } from "@/infra/http/presenters/farm-presenter";
import { OrderCompletePresenter } from "@/infra/http/presenters/order-complete-presenter";

const listFarmOrdersSchema = {
  query: z.object({
    cycle_id: z.string().uuid(),
  }),
  params: z.object({
    farm_id: z.string().uuid(),
  }),
};

export async function listFarmOrdersController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { farm_id } = listFarmOrdersSchema.params.parse(request.params);
    const { cycle_id } = listFarmOrdersSchema.query.parse(request.query);

    const listFarmOrdersUseCase = container.resolve<ListFarmOrdersUseCase>(
      "listFarmOrdersUseCase"
    );

    const { farm, orders } = await listFarmOrdersUseCase.execute({
      farm_id,
      cycle_id,
    });

    return response.status(200).send({
      ...FarmPresenter.toHttp(farm),
      orders: orders.map((order) => OrderCompletePresenter.toHttp(order)),
    });
  } catch (error) {
    next(error);
  }
}
