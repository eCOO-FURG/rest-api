// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { ReportBagsUseCase } from "@/core/use-cases/report-bags";

// Container
import container from "@/infra/container";

// Validation
export const reportBagsControllerSchema = {
  query: z.object({
    since: z.string().optional(),
    before: z.string().optional(),
  }),
};

export async function reportBagsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { since, before } = reportBagsControllerSchema.query.parse(request.query);

    const sinceDate = since ? new Date(since) : undefined;
    const beforeDate = before ? new Date(before) : undefined;

    const generateBagsReportUseCase = container.resolve<ReportBagsUseCase>(
      "reportBagsUseCase"
    );

    const buffer = await generateBagsReportUseCase.execute({
      since: sinceDate,
      before: beforeDate,
    });

    response.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    response.setHeader(
      "Content-Disposition",
      `attachment; filename="relatorio-sacolas.xlsx"`
    );

    return response.status(200).send(buffer);
  } catch (error) {
    next(error);
  }
}
