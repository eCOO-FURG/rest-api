// Libraries
import { NextFunction, Request, Response } from "express";

// Container
import container from "@/infra/container";

// Use-cases
import { ListCyclesUseCase } from "@/core/use-cases/list-cycles";

// Presenters
import { CyclePresenter } from "@/infra/http/presenters/cycle-presenter";

export async function listCyclesController(_: Request, response: Response, next: NextFunction) {
  try {
    const listCyclesUseCase = container.resolve<ListCyclesUseCase>("listCyclesUseCase");

    const { cycles } = await listCyclesUseCase.execute();

    return response.status(200).send(cycles.map((cycle) => CyclePresenter.toHttp(cycle)));
  } catch (error) {
    next(error);
  }
}
