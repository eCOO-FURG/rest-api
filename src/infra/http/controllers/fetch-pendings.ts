// Libraries
import { z } from "zod";
import { NextFunction, Request, Response } from "express";

// Use-cases
import { FetchPendingsUseCase } from "@/core/use-cases/fetch-pendings";

// Container
import container from "@/infra/container";

export const fetchPendingsSchema = {
  query: z.object({
    cycle_id: z.string().uuid(),
  }),
};

export async function fetchPendingsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { cycle_id } = fetchPendingsSchema.query.parse(request.query);

    const fetchPendingsUseCase = container.resolve<FetchPendingsUseCase>(
      "fetchPendingsUseCase"
    );

    const pendings = await fetchPendingsUseCase.execute({
      cycle_id,
    });

    return response.status(200).send(pendings);
  } catch (error) {
    next(error);
  }
}
