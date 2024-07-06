// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { VerifyUserUsecase } from "@/core/use-cases/verify-user";

// Container
import container from "@/infra/container";

const verifyUserSchema = {
  query: z.object({
    token: z.string(),
  }),
};

export async function verifyUserController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { token } = verifyUserSchema.query.parse(request.query);

    const verifyUserUseCase =
      container.resolve<VerifyUserUsecase>("verifyUserUseCase");

    await verifyUserUseCase.execute({ token });

    return response.status(200).send();
  } catch (error) {
    next(error);
  }
}
