// Libs
import { NextFunction, Request, Response, RequestHandler } from "express";

// Core
import { Role } from "@/core/entities/user";

// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";

// Container
import container from "@/infra/container";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { UnauthorizedError } from "@/core/errors/unauthorized";

// Repositories
import { PrismaFarmsRepository } from "@/infra/database/repositories/prisma-farms-repository";

export function ensureRole(roles: Role[]): RequestHandler {
  return async (request: Request, _: Response, next: NextFunction) => {
    try {
      const usersRepository =
        container.resolve<UsersRepository>("usersRepository");

      const user = await usersRepository.findById(request.user_id);

      if (!user) throw new ResourceNotFoundError("Usuário", request.user_id);

      const allowed = roles.some((role) => user.roles.includes(role));

      if (!allowed) throw new UnauthorizedError();

      if (roles.includes("PRODUCER")) {
        const farmsRepository =
          container.resolve<PrismaFarmsRepository>("farmsRepository");

        const farm = await farmsRepository.search(
          { admin: { id: request.user_id } },
          "entity"
        );

        if (!farm) throw new ResourceNotFoundError("Fazenda", request.user_id);

        request.farm_id = farm.id.value;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
