// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { PrintDeliveriesReportUseCase } from "@/core/use-cases/print-deliveries-report/print-deliveries-report";

// Container
import container from "@/infra/container";

const printDeliveriesReportSchema = {
  query: z.object({
    cycle_id: z.string().uuid(),
  }),
};

export async function printDeliveriesReportController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { cycle_id } = printDeliveriesReportSchema.query.parse(request.query);

    const printDeliveriesReportUseCase =
      container.resolve<PrintDeliveriesReportUseCase>("printDeliveriesReport");

    await printDeliveriesReportUseCase.execute({ cycle_id });

    const pdfBuffer = await printDeliveriesReportUseCase.execute({ cycle_id });

    response.setHeader(
      "Content-Disposition",
      'attachment; filename="report.pdf"'
    );
    response.setHeader("Content-Type", "application/pdf");
    response.setHeader("Content-Length", pdfBuffer.length);

    response.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
}
