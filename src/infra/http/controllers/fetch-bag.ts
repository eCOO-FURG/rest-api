// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Container
import container from "@/infra/container";

// Use-cases
import { FetchBagUseCase } from "@/core/use-cases/fetch-bag";

const fetchBagSchema = {
  param: z.object({
    bag_id: z.string().uuid(),
  }),
};

export async function fetchBagController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { bag_id } = fetchBagSchema.param.parse(request.params);

    const fetchBagUseCase =
      container.resolve<FetchBagUseCase>("fetchBagUseCase");

    const { bag, orders } = await fetchBagUseCase.execute({ bag_id });

    return response.status(200).send({ bag, orders });

    // to:do - set presenter
  } catch (error) {
    next(error);
  }
}
