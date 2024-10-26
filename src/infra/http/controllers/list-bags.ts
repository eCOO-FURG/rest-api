// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Container
import container from "@/infra/container";

// Use-cases
import { ListBagsUseCase } from "@/core/use-cases/list-bags";

// Presenters
import { BagPresenter } from "@/infra/http/presenters/bag-presenter";

export const listBagsSchema = {
  query: z.object({
    page: z.coerce.number().openapi({ description: "Página da listagem." }),
    cycle_id: z.string().uuid().openapi({ description: "Ciclo da busca." }),
    status: z
      .enum(["PENDING", "SEPARATED", "DISPATCHED", "RECEIVED", "CANCELLED", "DEFERRED"])
      .array()
      .optional()
      .openapi({ type: "array", items: { type: "string" }, description: "Filtro de status." }),
    name: z
      .string()
      .optional()
      .openapi({ description: "Filtro de nome do dono da sacola." }),
  }),
};

export async function listBagsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { cycle_id, page, name, status } = listBagsSchema.query.parse(
      request.query
    );

    const listBagsUsecase =
      container.resolve<ListBagsUseCase>("listBagsUseCase");

    const { bags } = await listBagsUsecase.execute({
      cycle_id,
      page,
      name,
      status,
    });

    return response
      .status(200)
      .send(bags.map((bag) => BagPresenter.toHttp(bag)));
  } catch (error) {
    next(error);
  }
}
