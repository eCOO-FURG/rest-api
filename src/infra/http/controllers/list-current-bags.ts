// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Container
import container from "@/infra/container";

// Use-cases
import { ListCurrentBagsUseCase } from "@/core/use-cases/list-current-bags";

// Presenters
import { BagPresenter } from "@/infra/http/presenters/bag-presenter";

export const listCurrentBagsSchema = {
  query: z.object({
    page: z.coerce.number().openapi({ description: "Página da listagem." }),
    cycle_id: z.string().uuid().openapi({ description: "Ciclo da busca." }),
    status: z
      .enum([
        "PENDING",
        "SEPARATED",
        "DISPATCHED",
        "RECEIVED",
        "CANCELLED",
        "DEFERRED",
      ])
      .optional()
      .openapi({ type: "string", description: "Filto de status." }),
    name: z
      .string()
      .optional()
      .openapi({ description: "Filtro de nome do dono da sacola." }),
  }),
};

export async function listCurrentBagsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { cycle_id, page, name, status } = listCurrentBagsSchema.query.parse(
      request.query
    );

    const listBagsUsecase = container.resolve<ListCurrentBagsUseCase>(
      "listCurrentBagsUseCase"
    );

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
