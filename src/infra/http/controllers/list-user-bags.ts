// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Container
import container from "@/infra/container";

// Use-cases
import { ListUserBagsUseCase } from "@/core/use-cases/list-user-bags";

// Presenters
import { BagPresenter } from "@/infra/http/presenters/bag-presenter";

export const listUserBagsSchema = {
  query: z.object({
    page: z.coerce.number().openapi({ description: "Página da listagem." }),
  }),
  body: z.object({
    date: z
      .string()
      .regex(/^\d{2}-\d{2}-\d{4}$/)
      .openapi({ description: "Data da busca." }),
  }),
};

export async function listUserBagsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { page } = listUserBagsSchema.query.parse(request.query);
    const { date } = listUserBagsSchema.body.parse(request.body);
    const user_id = request.user_id;

    const listUserBagsUsecase = container.resolve<ListUserBagsUseCase>(
      "listUserBagsUseCase"
    );

    const { bags } = await listUserBagsUsecase.execute({
      user_id,
      date,
      page,
    });

    return response
      .status(200)
      .send(bags.map((bag) => BagPresenter.toHttp(bag)));
  } catch (error) {
    next(error);
  }
}
