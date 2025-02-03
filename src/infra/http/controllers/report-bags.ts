// Libraries
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { ReportBagsUseCase } from "@/core/use-cases/report-bags";

// Container
import container from "@/infra/container";

// Validation
import { realPeriod } from "@/infra/http/validation/real-period";

// Utils
import { toDate } from "@/infra/utils/to-date";

export const reportBagsControllerSchema = {
  query: z
    .object({
      since: z
        .string()
        .regex(/^\d{2}-\d{2}-\d{4}$/, "Formato esperado: DD-MM-YYYY")
        .optional()
        .openapi({ description: "Bags criadas a partir dessa data." }),
      before: z
        .string()
        .regex(/^\d{2}-\d{2}-\d{4}$/, "Formato esperado: DD-MM-YYYY")
        .optional()
        .openapi({ description: "Bags criadas antes dessa data." }),
    })
    .refine(
      (data) => realPeriod.validation(toDate(data.since), toDate(data.before)),
      realPeriod.warning
    ),
};

export async function reportBagsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { since, before } = reportBagsControllerSchema.query.parse(
      request.query
    );

    const reportBagsUseCase =
      container.resolve<ReportBagsUseCase>("reportBagsUseCase");

    const spreadsheet = await reportBagsUseCase.execute({
      since: toDate(since),
      before: toDate(before),
    });

    response.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    response.setHeader(
      "Content-Disposition",
      `attachment; filename="relatorio-sacolas.xlsx"`
    );

    response.send(spreadsheet);
  } catch (error) {
    next(error);
  }
}
