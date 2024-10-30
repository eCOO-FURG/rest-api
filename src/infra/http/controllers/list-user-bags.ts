// Libs
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
import { realPeriod } from "@/infra/http/validation/real-period";

// Utils
import { toArray } from "@/infra/utils/to-array";

// Entities
import { Bag } from "@/core/entities/bag";

export const listUserBagsSchema = {
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
      (data) => realPeriod.validation(toDate(data.since), toDate(data.before)),
      realPeriod.warning
    ),
};

export async function listUserBagsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { page, since, before, statuses, cycle_id } =
      listUserBagsSchema.query.parse(request.query);

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
