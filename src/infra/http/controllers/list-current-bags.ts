// Libraries
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Container
import container from "@/infra/container";

// Use-cases
import { ListCurrentBagsUseCase } from "@/core/use-cases/list-current-bags";

// Presenters
import { BagPresenter } from "@/infra/http/presenters/bag-presenter";

// Validation
import { options } from "@/infra/http/validation/options";
import { toArray } from "@/infra/utils/to-array";

// Entities
import { Bag, BAG_STATUSES } from "@/core/entities/bag";

export const listCurrentBagsSchema = {
  query: z
    .object({
      page: z.coerce.number().openapi({ description: "Página da listagem." }),
      cycle_id: z.string().uuid().openapi({ description: "Ciclo da busca." }),
      statuses: z.string().optional().openapi({
        description: "Filtro de status, separados por vírgula.",
      }),
      user: z
        .string()
        .optional()
        .openapi({ description: "Filtro de nome do dono da sacola." }),
    })
    .refine(
      (data) =>
        !data.statuses || options.validation(data.statuses, BAG_STATUSES),
      options.warning
    ),
};

export async function listCurrentBagsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { cycle_id, page, user, statuses } =
      listCurrentBagsSchema.query.parse(request.query);

    const listCurrentBagsUseCase = container.resolve<ListCurrentBagsUseCase>(
      "listCurrentBagsUseCase"
    );

    const { bags } = await listCurrentBagsUseCase.execute({
      cycle_id,
      page,
      user,
      statuses: toArray<Bag["status"]>(statuses),
    });

    return response
      .status(200)
      .send(bags.map((bag) => BagPresenter.toHttp(bag)));
  } catch (error) {
    next(error);
  }
}
