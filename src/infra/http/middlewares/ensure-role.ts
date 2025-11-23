// Libraries
import { NextFunction, Request, Response, RequestHandler } from "express";

// Core
import { UserRole } from "@/core/entities/user";

// Repositories
import { FarmsRepository } from "@/core/repositories/farms-repository";

// Container
import container from "@/infra/container";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { UnauthorizedError } from "@/core/errors/unauthorized";

export function ensureRole(roles: UserRole[]): RequestHandler {
  return async (request: Request, _: Response, next: NextFunction) => {
    try {
      const allowed = roles.some((role) => request.roles.includes(role));

      if (!allowed) {
        throw new UnauthorizedError();
      }

      if (roles.includes("PRODUCER")) {
        const farm = await container.resolve<FarmsRepository>("farmsRepository").find("farm", {
          admin: { id: request.user_id },
        });

        if (farm) {
          request.farm_id = farm.id.value;
        } else if (roles.length === 1) {
          throw new ResourceNotFoundError("Fazenda", request.user_id);
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
