// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Container
import container from "@/infra/container";

// Use-cases
import { ListCurrentBagsUseCase } from "@/core/use-cases/list-current-bags";

// Presenters
import { BagPresenter } from "@/infra/http/presenters/bag-presenter";

// Validations
import { optionList } from "@/infra/http/validation/option-list";
import { toArray } from "@/infra/utils/to-array";

// Entities
import { Bag } from "@/core/entities/bag";

export const listCurrentBagsSchema = {
  query: z
    .object({
      page: z.coerce.number().openapi({ description: "Página da listagem." }),
      cycle_id: z.string().uuid().openapi({ description: "Ciclo da busca." }),
      statuses: z
        .string()
        .optional()
        .openapi({ description: "Filtro de status, separados por vírgula." }),
      name: z
        .string()
        .optional()
        .openapi({ description: "Filtro de nome do dono da sacola." }),
    })
    .refine(
      (data) => data.statuses && optionList.validation(data.statuses),
      optionList.warning
    ),
};

export async function listCurrentBagsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { cycle_id, page, name, statuses } =
      listCurrentBagsSchema.query.parse(request.query);

    const listCurrentBagsUseCase = container.resolve<ListCurrentBagsUseCase>(
      "listCurrentBagsUseCase"
    );

    const { bags } = await listCurrentBagsUseCase.execute({
      cycle_id,
      page,
      name,
      statuses: toArray<Bag["status"]>(statuses),
    });

    return response
      .status(200)
      .send(bags.map((bag) => BagPresenter.toHttp(bag)));
  } catch (error) {
    next(error);
  }
}
