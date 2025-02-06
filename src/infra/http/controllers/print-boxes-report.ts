// Libs
import { NextFunction, Request, Response } from "express";

// Use-cases
import { PrintBoxesReportUseCase } from "@/core/use-cases/print-boxes-report";

// Container
import container from "@/infra/container";
import { z } from "zod";

export const printBoxesReportSchema = {
  query: z.object({
    cycle_id: z.string().uuid(),
  }),
};

export async function printBoxesReportController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { cycle_id } = printBoxesReportSchema.query.parse(
      request.query
    );

    const printBoxesReportUseCase = container.resolve<PrintBoxesReportUseCase>(
      "printBoxesReportUseCase"
    );

    const { pdf } = await printBoxesReportUseCase.execute({
      cycle_id
    });

    response.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="caixas.pdf"',
      "Content-Length": pdf.length,
    });

    response.send(pdf);
  } catch (error) {
    next(error);
  }
}
