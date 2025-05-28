// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";

// Container
import container from "@/infra/container";

// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";
import { SessionsRepository } from "@/core/repositories/sessions-repository";

// Env
import { env } from "@/infra/env";

// Errors
import { SessionExpiredError } from "@/core/errors/session-expired";

// Validation
import { parse } from "@/infra/http/validation/parse";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Utils
import { now } from "@/core/utils/now";

const jwtPayloadSchema = Joi.object({
  user_id: Joi.string().required(),
  iat: Joi.number().required(),
});

export async function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) throw new SessionExpiredError();

    const [, token] = authHeader.split(" ");

    const payload = verify(token, env.JWT_SECRET, { ignoreExpiration: true });

    const { user_id, iat } = parse(jwtPayloadSchema, payload);

    const user = await container.resolve<UsersRepository>("usersRepository").find("user", {
      id: user_id,
    });

    if (!user) throw new ResourceNotFoundError("Usuário", user_id);

    const lifetimeInSeconds = new Date().getTime() / 1000 - iat;

    const expired = lifetimeInSeconds > 5 * 60;

    if (expired) {
      const session = await container.resolve<SessionsRepository>("sessionsRepository").find("session", {
        user: { id: user_id },
        ip: request.ip!,
        agent: request.headers["user-agent"] ?? "not-identified",
        since: now({ minus: 60 }),
      });

      if (!session) throw new SessionExpiredError();

      response.header("set-cookie", `token=${sign({ user_id }, env.JWT_SECRET)}`);
    }

    request.user_id = user.id.value;
    request.admin = user.admin;
    request.roles = user.roles;

    next();
  } catch (error) {
    next(error);
  }
}
