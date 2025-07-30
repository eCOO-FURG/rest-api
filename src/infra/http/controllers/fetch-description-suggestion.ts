// Libraries
import { Request, Response, NextFunction } from "express";
import Joi from "joi";

// Container
import container from "@/infra/container";

// Validation
import { parse } from "@/infra/http/validation/parse";
import { FetchDescriptionSuggestionUseCase } from "@/core/use-cases/fetch-description-suggestion";

export const fetchDescriptionSuggestionParams = Joi.object({
  product_id: Joi.string().uuid().required(),
});

export async function fetchDescriptionSuggestionController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { product_id } = parse(fetchDescriptionSuggestionParams, req.params);

    const useCase = container.resolve<FetchDescriptionSuggestionUseCase>(
      "fetchDescriptionSuggestionUseCase",
    );

    const { description } = await useCase.execute({ product_id });

    return res.status(200).json({ description });
  } catch (error) {
    next(error);
  }
}
