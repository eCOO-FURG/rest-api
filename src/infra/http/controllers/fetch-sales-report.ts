// Libraries
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { FetchSalesReportUseCase } from "@/core/use-cases/fetch-sales-report";

// Container
import container from "@/infra/container";

// Utils
import { toDate } from "@/infra/utils/to-date";
import { toBoolean } from "@/infra/utils/to-boolean";

// Validation
import { period } from "@/infra/http/validation/period";

export const fetchSalesReportSchema = {
  query: z
    .object({
      cycle_id: z.string().uuid().optional(),
      withdraw: z.enum(["true", "false"]).optional(),
      type: z.enum(["pdf", "spreadsheet"]),
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

export async function fetchSalesReportController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { cycle_id, withdraw, type, since, before } =
      fetchSalesReportSchema.query.parse(request.query);

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
