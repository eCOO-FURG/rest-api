// Libraries
import Joi from "joi";
import { Request, Response, NextFunction } from "express";

// Use-case
import { FetchOffersReportUseCase } from "@/core/use-cases/fetch-offers-report";

// Container
import container from "@/infra/container";

// Utils
import { toDate } from "@/infra/utils/to-date";

// Validation
import { parse } from "@/infra/http/validation/parse";

export const fetchOffersReportQuery = Joi.object({
  cycle_id: Joi.string().uuid().optional(),
  type: Joi.string().valid("pdf", "spreadsheet").required(),
  since: Joi.string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "DD-MM-YYYY")
    .optional(),
  before: Joi.string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "DD-MM-YYYY")
    .optional(),
});

export async function fetchOffersReportController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { cycle_id, type, since, before } = parse(fetchOffersReportQuery, request.query);

    const fetchOffersReportUseCase = container.resolve<FetchOffersReportUseCase>(
      "fetchOffersReportUseCase"
    );

    const { file } = await fetchOffersReportUseCase.execute({
      cycle_id,
      type,
      since: toDate(since),
      before: toDate(before),
    });

    response.set({
      "Content-Type": file.mimetype,
      "Content-Disposition": `attachment; filename="${file.name}"`,
      "Content-Length": file.size.toString(),
    });

    response.send(file.content);
  } catch (error) {
    next(error);
  }
}
