// Libraries
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Container
import container from "@/infra/container";

// Use-cases
import { FetchBoxUseCase } from "@/core/use-cases/fetch-box";

// Presenters
import { BoxPresenter } from "@/infra/http/presenters/box-presenter";

export const fetchBoxSchema = {
  route: z.object({
    box_id: z.string().uuid(),
  }),
  query: z.object({
    page: z.coerce.number(),
  }),
};

export async function fetchBoxController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { box_id } = fetchBoxSchema.route.parse(request.params);
    const { page } = fetchBoxSchema.query.parse(request.query);

    const fetchBoxUseCase =
      container.resolve<FetchBoxUseCase>("fetchBoxUseCase");

    const { box } = await fetchBoxUseCase.execute({
      user_id: request.user_id,
      box_id,
      page,
    });

    return response.status(200).send(BoxPresenter.toHttp(box));
  } catch (error) {
    next(error);
  }
}
