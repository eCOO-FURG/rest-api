// Use-cases
import { ListBoxesUseCase } from "@/core/use-cases/list-boxes";

// Container
import container from "@/infra/container";

// Libs
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// Presenters
import { BoxPresenter } from "@/infra/http/presenters/box-presenter";

export const listBoxesSchema = {
  query: z.object({
    cycle_id: z
      .string()
      .uuid()
      .openapi({ description: "O ciclo de busca das caixas." }),
    page: z.coerce.number().openapi({ description: "A página de busca." }),
    farm: z.string().optional().openapi({
      description: "O filtro por nome de fazenda responsável pela caixa.",
    }),
  }),
};

export async function listBoxesController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { cycle_id, page, farm } = listBoxesSchema.query.parse(request.query);

    const listBoxesUseCase =
      container.resolve<ListBoxesUseCase>("listBoxesUseCase");

    const { boxes } = await listBoxesUseCase.execute({
      cycle_id,
      page,
      farm,
    });

    return response
      .status(200)
      .send(boxes.map((farm) => BoxPresenter.toHttp(farm)));
  } catch (error) {
    next(error);
  }
}
