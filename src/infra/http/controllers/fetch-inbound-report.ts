// Libraries
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { FetchInboundReportUseCase } from "@/core/use-cases/fetch-inbound-report";

// Container
import container from "@/infra/container";

// Utils
import { toDate } from "@/infra/utils/to-date";
import { period } from "@/infra/http/validation/period";

export const fetchInboundReportSchema = {
  query: z
    .object({
      cycle_id: z.string().uuid().optional(),
      since: z
        .string()
        .regex(/^\d{2}-\d{2}-\d{4}$/, "Formato esperado: DD-MM-YYYY")
        .optional(),
      before: z
        .string()
        .regex(/^\d{2}-\d{2}-\d{4}$/, "Formato esperado: DD-MM-YYYY")
        .optional(),
    })
    .refine(
      (data) => period.validation(toDate(data.since), toDate(data.before)),
      period.warning
    ),
};

export async function fetchInboundReportController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { cycle_id, since, before } = fetchInboundReportSchema.query.parse(
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
