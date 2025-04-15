// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Use-cases
import { FetchPendingsUseCase } from "@/core/use-cases/fetch-pendings";

// Container
import container from "@/infra/container";

// Validation
import { parse } from "@/infra/http/validation/parse";

export const fetchPendingsQuery = Joi.object({
  cycle_id: Joi.string().uuid().required(),
});

export async function fetchPendingsController(request: Request, response: Response, next: NextFunction) {
  try {
    const { cycle_id } = parse(fetchPendingsQuery, request.query);

    const fetchPendingsUseCase = container.resolve<FetchPendingsUseCase>("fetchPendingsUseCase");

    const pendings = await fetchPendingsUseCase.execute({
      cycle_id,
    });

    return response.status(200).send(pendings);
  } catch (error) {
    next(error);
  }
}
