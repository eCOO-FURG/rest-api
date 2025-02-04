// Libraries
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Container
import container from "@/infra/container";

// Use-cases
import { ListBagsUseCase } from "@/core/use-cases/list-bags";

// Presenters
import { BagPresenter } from "@/infra/http/presenters/bag-presenter";

// Utils
import { toDate } from "@/infra/utils/to-date";

// Validation
import { period } from "@/infra/http/validation/period";

// Utils
import { toArray } from "@/infra/utils/to-array";

// Entities
import { Bag, BAG_STATUSES } from "@/core/entities/bag";

// Validation
import { options } from "@/infra/http/validation/options";

export const listOwnBagsSchema = {
  query: z
    .object({
      page: z.coerce.number().openapi({ description: "Página da listagem." }),
      cycle_id: z
        .string()
        .uuid()
        .optional()
        .openapi({ description: "Ciclo da busca." }),
      statuses: z
        .string()
        .optional()
        .openapi({ description: "Filtro de status, separados por vírgula." }),
      since: z
        .string()
        .regex(/^\d{2}-\d{2}-\d{4}$/, "Formato esperado: DD-MM-YYYY")
        .optional()
        .openapi({ description: "Bags criadas a partir dessa data." }),
      before: z
        .string()
        .regex(/^\d{2}-\d{2}-\d{4}$/, "Formato esperado: DD-MM-YYYY")
        .optional()
        .openapi({ description: "Bags criadas antes dessa data." }),
    })
    .refine(
      (data) =>
        !data.statuses || options.validation(data.statuses, BAG_STATUSES),
      options.warning
    )
    .refine(
      (data) => period.validation(toDate(data.since), toDate(data.before)),
      period.warning
    ),
};

export async function listOwnBagsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { page, since, before, statuses, cycle_id } =
      listOwnBagsSchema.query.parse(request.query);

    const listBagsUseCase =
      container.resolve<ListBagsUseCase>("listBagsUseCase");

    const { bags } = await listBagsUseCase.execute({
      user_id: request.user_id,
      cycle_id,
      statuses: toArray<Bag["status"]>(statuses),
      since: toDate(since),
      before: toDate(before),
      page,
    });

    return response
      .status(200)
      .send(bags.map((bag) => BagPresenter.toHttp(bag)));
  } catch (error) {
    next(error);
  }
}
