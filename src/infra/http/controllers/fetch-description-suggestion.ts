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

    const { stream } = await useCase.execute({ product_id });

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    for await (const chunk of stream) {
      res.write(chunk);
    }

    res.end();
  } catch (error) {
    next(error);
  }
}
