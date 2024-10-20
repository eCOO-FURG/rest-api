// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Container
import container from "@/infra/container";

// Use-cases
import { FetchBagUseCase } from "@/core/use-cases/fetch-bag";

// Presenters
import { BagMergePresenter } from "@/infra/http/presenters/bag-merge-presenter";

export const fetchUserBagSchema = {
  route: z.object({
    bag_id: z.string().uuid(),
  }),
};

export async function fetchUserBagController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { bag_id } = fetchUserBagSchema.route.parse(request.params);

    const fetchBagUseCase =
      container.resolve<FetchBagUseCase>("fetchBagUseCase");

    const { bag } = await fetchBagUseCase.execute({
      bag_id,
      user_id: request.user_id,
    });

    return response.status(200).send(BagMergePresenter.toHttp(bag));
  } catch (error) {
    next(error);
  }
}
