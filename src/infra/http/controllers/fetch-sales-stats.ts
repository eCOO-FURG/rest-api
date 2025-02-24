// Libraries
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { FetchSalesStatsUseCase } from "@/core/use-cases/fetch-sales-stats";

// Container
import container from "@/infra/container";

// Utils
import { toDate } from "@/infra/utils/to-date";

// Validation
import { period } from "@/infra/http/validation/period";

export const fetchSalesStatsSchema = {
  query: z
    .object({
      since: z
        .string()
        .regex(/^\d{2}-\d{2}-\d{4}$/, "Formato esperado: DD-MM-YYYY")
        .optional()
        .openapi({
          description: "Data inicial do período (DD-MM-YYYY)",
          format: "date",
          pattern: "^\\d{2}-\\d{2}-\\d{4}$",
          example: "01-01-2025",
        }),
      before: z
        .string()
        .regex(/^\d{2}-\d{2}-\d{4}$/, "Formato esperado: DD-MM-YYYY")
        .optional()
        .openapi({
          description: "Data final do período (DD-MM-YYYY)",
          format: "date",
          pattern: "^\\d{2}-\\d{2}-\\d{4}$",
          example: "31-12-2025",
        }),

      method: z.enum(["CREDIT", "DEBIT", "CASH", "PIX"]).optional().openapi({
        description: "Método de pagamento",
        example: "CREDIT",
      }),
    })
    .refine(
      (data) => period.validation(toDate(data.since), toDate(data.before)),
      period.warning
    ),
};

export async function fetchSalesStatsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { since, before, method } = fetchSalesStatsSchema.query.parse(
      request.query
    );

    const fetchSalesStatsUseCase = container.resolve<FetchSalesStatsUseCase>(
      "fetchSalesStatsUseCase"
    );

    const stats = await fetchSalesStatsUseCase.execute({
      since: toDate(since),
      before: toDate(before),
      method,
    });

    return response.status(200).json(stats);
  } catch (error) {
    next(error);
  }
}
