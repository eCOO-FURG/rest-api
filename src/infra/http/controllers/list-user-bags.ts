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

export const listUserBagsSchema = {
  query: z.object({
    page: z.coerce.number().openapi({ description: "Página da listagem." }),
  }),
  body: z
    .object({
      since: z
        .string()
        .regex(/^\d{2}-\d{2}-\d{4}$/)
        .optional()
        .openapi({ description: "Bags criadas a partir dessa data." }),
      before: z
        .string()
        .regex(/^\d{2}-\d{2}-\d{4}$/)
        .optional()
        .openapi({ description: "Bags criadas antes dessa data." }),
    })
    .refine(
      ({ since, before }) =>
        since && before && toDate(since)! > toDate(before)!,
      {
        message: "A data 'since' não pode ser depois da data do 'before'.",
        path: ["since", "before"],
      }
    ),
};

export async function listUserBagsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { page } = listUserBagsSchema.query.parse(request.query);
    const { since, before } = listUserBagsSchema.body.parse(request.body);

    const listBagsUseCase =
      container.resolve<ListBagsUseCase>("listBagsUseCase");

    const { bags } = await listBagsUseCase.execute({
      user_id: request.user_id,
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
