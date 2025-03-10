// Libraries
import { NextFunction, Request, Response, RequestHandler } from "express";

// Core
import { UserRole } from "@/core/entities/user";

// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";
import { FarmsRepository } from "@/core/repositories/farms-repository";

// Container
import container from "@/infra/container";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { UnauthorizedError } from "@/core/errors/unauthorized";

export function ensureRole(roles: UserRole[]): RequestHandler {
  return async (request: Request, _: Response, next: NextFunction) => {
    try {
      const usersRepository =
        container.resolve<UsersRepository>("usersRepository");

      const user = await usersRepository.find("basic", { id: request.user_id });

      if (!user) throw new ResourceNotFoundError("Usuário", request.user_id);

      const allowed = roles.some((role) => user.roles.includes(role));

      if (!allowed) throw new UnauthorizedError();

      if (roles.includes("PRODUCER")) {
        const farmsRepository =
          container.resolve<FarmsRepository>("farmsRepository");

        const farm = await farmsRepository.find("basic", {
          admin: { id: request.user_id },
        });

        if (!farm) throw new ResourceNotFoundError("Fazenda", request.user_id);

        request.farm_id = farm.id.value;
      }

      request.admin = user.admin;

      next();
    } catch (error) {
      next(error);
    }
  };
}
