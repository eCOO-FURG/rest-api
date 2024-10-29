// Libs
import { NextFunction, Request, Response } from "express";

// Container
import container from "@/infra/container";

// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";

export async function ensureAdmin(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const user_id = request.user_id;

  const usersRepository = container.resolve<UsersRepository>("usersRepository");

  const user = await usersRepository.findById(user_id);

  if (!user) {
    return response
      .status(401)
      .send({ message: "Sessão expirada.", code: "session-expired" });
  }

  if (!user.roles.includes("ADMIN")) {
    return response
      .status(401)
      .send({ message: "Não autorizado.", code: "not-admin" });
  }

  next();
}
