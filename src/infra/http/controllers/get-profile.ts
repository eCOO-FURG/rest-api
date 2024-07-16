// Container
import container from "@/infra/container";

//Libs
import { NextFunction, Request, Response } from "express";

// Use-cases
import { GetProfileUseCase } from "@/core/use-cases/get-profile";

// Presenter
import { UserPresenter } from "@/infra/http/presenters/user-presenter";

export async function getUserController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const getProfileUseCase =
      container.resolve<GetProfileUseCase>("getProfileUseCase");

    const { user } = await getProfileUseCase.execute({ id: request.user_id });

    return response.status(200).send(UserPresenter.toHttp(user));
  } catch (error) {
    next(error);
  }
}
