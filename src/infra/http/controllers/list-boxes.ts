// Use-cases
import { ListBoxesUseCase } from "@/core/use-cases/list-boxes";

// Container
import container from "@/infra/container";

// Libs
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// Presenters
import { BoxPresenter } from "@/infra/http/presenters/box-presenter";

const listBoxesSchema = {
  query: z.object({
    cycle_id: z.string().uuid(),
    page: z.coerce.number(),
    name: z.string().optional(),
  }),
};

export async function listBoxesController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { cycle_id, page, name } = listBoxesSchema.query.parse(request.query);

    const listBoxesUseCase =
      container.resolve<ListBoxesUseCase>("listBoxesUseCase");

    const { boxes } = await listBoxesUseCase.execute({
      cycle_id,
      page,
      name,
    });

    return response
      .status(200)
      .send(boxes.map((farm) => BoxPresenter.toHttp(farm)));
  } catch (error) {
    next(error);
  }
}
