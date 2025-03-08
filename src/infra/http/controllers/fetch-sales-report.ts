// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Use-cases
import { FetchSalesReportUseCase } from "@/core/use-cases/fetch-sales-report";

// Container
import container from "@/infra/container";

// Utils
import { toDate } from "@/infra/utils/to-date";
import { toBoolean } from "@/infra/utils/to-boolean";

// Validation
import { parse } from "@/infra/http/validation/parse";

export const fetchSalesReportQuery = Joi.object({
  cycle_id: Joi.string().uuid().optional(),
  withdraw: Joi.string().valid("true", "false"),
  type: Joi.string().valid("pdf", "spreadsheet").required(),
  since: Joi.string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "Formato esperado: DD-MM-YYYY")
    .regex(/^\d{2}-\d{2}-\d{4}$/, "Formato esperado: DD-MM-YYYY")
    .optional(),
  before: Joi.string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "Formato esperado: DD-MM-YYYY")
    .optional(),
});

export async function fetchSalesReportController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { cycle_id, withdraw, type, since, before } = parse(
      fetchSalesReportQuery,
      request.query
    );

    const fetchSalesReportUseCase = container.resolve<FetchSalesReportUseCase>(
      "fetchSalesReportUseCase"
    );

    const { file } = await fetchSalesReportUseCase.execute({
      cycle_id,
      type,
      withdraw: toBoolean(withdraw),
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
