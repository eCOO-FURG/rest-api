// Container
import container from "@/infra/container";

// Libraries
import { NextFunction, Request, Response } from "express";

// Use-cases
import { FetchWarehouseUseCase } from "@/core/use-cases/fetch-warehouse";

// Presenters
import { WarehousePresenter } from "@/infra/http/presenters/warehouse-presenter";

export async function fetchWarehouseController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const fetchWarehouseUseCase = container.resolve<FetchWarehouseUseCase>(
      "fetchWarehouseUseCase",
    );

    const { warehouse } = await fetchWarehouseUseCase.execute();

    return response.status(200).send(WarehousePresenter.toHttp(warehouse));
  } catch (error) {
    next(error);
  }
}
