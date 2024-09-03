// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Container
import container from "@/infra/container";

// Use-cases
import { FetchBoxUseCase } from "@/core/use-cases/fetch-box";

// Presenters
import { BoxPresenter } from "@/infra/http/presenters/box-presenter";
import { OrderPresenter } from "@/infra/http/presenters/order-presenter";

const listFarmOrdersSchema = {
  params: z.object({
    box_id: z.string().uuid(),
  }),
};

export async function fetchBoxController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { box_id } = listFarmOrdersSchema.params.parse(request.params);

    const fetchBoxUseCase =
      container.resolve<FetchBoxUseCase>("fetchBoxUseCase");

    const { box } = await fetchBoxUseCase.execute({
      box_id,
    });

    return response.status(200).send({
      ...BoxPresenter.toHttp(box),
      orders: box.orders.map((order) => OrderPresenter.toHttp(order)),
    });
  } catch (error) {
    next(error);
  }
}
