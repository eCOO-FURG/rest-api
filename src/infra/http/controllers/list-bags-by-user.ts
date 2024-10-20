// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Container
import container from "@/infra/container";

// Use-cases
import { ListUserBagsUseCase } from "@/core/use-cases/list-user-bags";

// Presenters
import { BagPresenter } from "@/infra/http/presenters/bag-presenter";

// Utils
import { toDate } from "@/infra/utils/to-date";

export const listBagsByUserSchema = {
  route: z.object({
    user_id: z.string().uuid(),
  }),
  query: z.object({
    page: z.coerce.number().openapi({ description: "Página da listagem." }),
  }),
  body: z.object({
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
  }),
};

export async function listBagsByUserController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { user_id } = listBagsByUserSchema.route.parse(request.params);
    const { page } = listBagsByUserSchema.query.parse(request.query);
    const { since, before } = listBagsByUserSchema.body.parse(request.body);

    const sinceDate = toDate(since);
    const beforeDate = toDate(before);

    if (sinceDate && beforeDate && sinceDate > beforeDate) {
      return response.status(422).send({
        error: "A data 'since' não pode ser depois da data do 'before'.",
      });
    }

    const listUserBagsUsecase = container.resolve<ListUserBagsUseCase>(
      "listUserBagsUseCase"
    );
    console.log("User ID:", user_id);

    const { bags } = await listUserBagsUsecase.execute({
      user_id,
      since: sinceDate,
      before: beforeDate,
      page,
    });

    return response
      .status(200)
      .send(bags.map((bag) => BagPresenter.toHttp(bag)));
  } catch (error) {
    next(error);
  }
}
