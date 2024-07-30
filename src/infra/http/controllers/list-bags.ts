// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Container
import container from "@/infra/container";
import { ListBagsUseCase } from "@/core/use-cases/list-bags";
import { BagAggregatePresenter } from "../presenters/bag-aggregate-presenter";

const listBagsSchema = {
  query: z.object({
    cycle_id: z.string().uuid(),
    page: z.coerce.number(),
    name: z.string().optional(),
  }),
};

export async function listBagsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { cycle_id, page, name } = listBagsSchema.query.parse(request.query);

    const listBagsUsecase =
      container.resolve<ListBagsUseCase>("listBagsUseCase");

    const { bags } = await listBagsUsecase.execute({ cycle_id, page, name });

    return response
      .status(200)
      .send(bags.map((bag) => BagAggregatePresenter.toHttp(bag)));
  } catch (error) {}
}
