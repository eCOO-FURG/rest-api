// Container
import container from "@/infra/container";

// Libraries
import { NextFunction, Request, Response } from "express";

// Use-cases
import { FetchProfileUseCase } from "@/core/use-cases/fetch-profile";

// Presenters
import { UserPresenter } from "@/infra/http/presenters/user-presenter";

export async function fetchProfileController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const getProfileUseCase = container.resolve<FetchProfileUseCase>("fetchProfileUseCase");

    const { user } = await getProfileUseCase.execute({
      user_id: request.user_id,
    });

    return response.status(200).send(UserPresenter.toHttp(user));
  } catch (error) {
    next(error);
  }
}
