// Libraries
import { NextFunction, Request, Response, RequestHandler } from "express";

// Core
import { Role } from "@/core/entities/user";

// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";
import { FarmsRepository } from "@/core/repositories/farms-repository";
// Container
import container from "@/infra/container";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { UnauthorizedError } from "@/core/errors/unauthorized";
import { FarmNotActiveError } from "@/core/errors/farm-not-active";

// Repositories

export function ensureRole(roles: Role[]): RequestHandler {
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

        if (farm.status !== "ACTIVE") throw new FarmNotActiveError();
        
        request.farm_id = farm.id.value;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
