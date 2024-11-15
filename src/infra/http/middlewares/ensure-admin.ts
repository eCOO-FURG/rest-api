// Libs
import { NextFunction, Request, Response } from "express";

// Container
import container from "@/infra/container";

// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";

export type AdminRoles = "BROKER" | "MANAGER";

export const ensureAdmin = (
  roles: [AdminRoles, ...AdminRoles[]]
): ((
  request: Request,
  response: Response,
  next: NextFunction
) => Promise<void>) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const user_id = request.user_id;

    const usersRepository =
      container.resolve<UsersRepository>("usersRepository");

    const user = await usersRepository.findById(user_id);

    if (!user) {
      response
        .status(401)
        .send({ message: "Sessão expirada.", code: "session-expired" });
      return next();
    }

    if (!roles.some((role) => user.roles.includes(role))) {
      response
        .status(401)
        .send({ message: "Não autorizado.", code: "not-admin" });
      return next();
    }

    next();
  };
};
