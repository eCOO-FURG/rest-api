// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { SearchOfferingFarmsUseCase } from "@/core/use-cases/search-offering-farms";

// Container
import container from "@/infra/container";

const searchOfferingFarmsSchema = {
  query: z.object({
    cycle_id: z.string(),
    page: z.coerce.number(),
    product: z.string().optional()
  }),
};

export async function searchOfferingFarmsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { cycle_id, page, product } = searchOfferingFarmsSchema.query.parse(request.query);

    const searchOfferingFarmsUseCase = container.resolve<SearchOfferingFarmsUseCase>(
      "searchOfferingFarmsUseCase"
    );

    await searchOfferingFarmsUseCase.execute({
      cycle_id,
      product,
      page
    });

    return response.sendStatus(200);
  } catch (error) {
    next(error);
  }
}
