// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Use-cases
import { FetchInboundReportUseCase } from "@/core/use-cases/fetch-inbound-report";

// Container
import container from "@/infra/container";

// Utils
import { toDate } from "@/infra/utils/to-date";

// Validation
import { parse } from "@/infra/http/validation/parse";

export const fetchInboundReportQuery = Joi.object({
  cycle_id: Joi.string().uuid().optional(),
  since: Joi.string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "Formato esperado: DD-MM-YYYY")
    .optional(),
  before: Joi.string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "Formato esperado: DD-MM-YYYY")
    .optional(),
});

export async function fetchInboundReportController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { cycle_id, since, before } = parse(
      fetchInboundReportQuery,
      request.query
    );

    const fetchInboundReportUseCase =
      container.resolve<FetchInboundReportUseCase>("fetchInboundReportUseCase");

    const { file } = await fetchInboundReportUseCase.execute({
      cycle_id,
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
