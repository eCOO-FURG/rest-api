// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { PrintBagsReportUseCase } from "@/core/use-cases/print-bags-report";

// Container
import container from "@/infra/container";

export const printBagsReportSchema = {
  query: z.object({
    cycle_id: z.string().uuid(),
    withdraw: z.enum(["true", "false"]).optional(),
  }),
};

export async function printBagsReportController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { cycle_id, withdraw } = printBagsReportSchema.query.parse(
      request.query
    );

    const printBagsReportUseCase = container.resolve<PrintBagsReportUseCase>(
      "printBagsReportUseCase"
    );

    const { pdf } = await printBagsReportUseCase.execute({
      cycle_id,
      withdraw: withdraw === "true",
    });

    response.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="sacolas.pdf"',
      "Content-Length": pdf.length,
    });

    response.send(pdf);
  } catch (error) {
    next(error);
  }
}
