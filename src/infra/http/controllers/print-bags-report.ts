// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { PrintBagsReportUseCase } from "@/core/use-cases/print-bags-report";

// Container
import container from "@/infra/container";

export const printBagsReportSchema = {
  route: z.object({
    cycle_id: z.string().uuid().openapi({
      description: "ID do ciclo que deseja imprimir o relatório de entregas.",
    }),
  }),
  query: z.object({
    withdraw: z
      .preprocess((val) => val === "true", z.boolean())
      .openapi({
        description:
          "Se for true, vai retornar a lista de retiradas. Se não, vai retornar a lista de entregas.",
      }),
  }),
};

export async function printBagsReportController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { cycle_id } = printBagsReportSchema.route.parse(request.params);

    const { withdraw } = printBagsReportSchema.query.parse(request.query);

    const printBagsReportUseCase =
      container.resolve<PrintBagsReportUseCase>("printBagsReport");

    await printBagsReportUseCase.execute({ cycle_id, withdraw });

    const { pdf } = await printBagsReportUseCase.execute({
      cycle_id,
      withdraw,
    });

    const filename = withdraw ? "retiradas.pdf" : "entregas.pdf";

    response.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": pdf.length,
    });

    response.send(pdf);
  } catch (error) {
    next(error);
  }
}
