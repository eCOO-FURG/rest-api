// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { PrintDeliveriesReportUseCase } from "@/core/use-cases/print-deliveries-report";

// Container
import container from "@/infra/container";

const printDeliveriesReportSchema = {
  params: z.object({
    cycle_id: z.string().uuid(),
  }),
};

export async function printDeliveriesReportController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { cycle_id } = printDeliveriesReportSchema.params.parse(
      request.params
    );

    const printDeliveriesReportUseCase =
      container.resolve<PrintDeliveriesReportUseCase>("printDeliveriesReport");

    await printDeliveriesReportUseCase.execute({ cycle_id });

    const { pdf } = await printDeliveriesReportUseCase.execute({ cycle_id });

    response.set({
      "Content-Disposition": 'attachment; filename="deliveries.pdf"',
      "Content-Type": "application/pdf",
      "Content-Length": pdf.length,
    });

    response.send(pdf);
  } catch (error) {
    next(error);
  }
}
