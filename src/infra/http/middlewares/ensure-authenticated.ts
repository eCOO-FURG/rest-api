// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { sign, verify } from "jsonwebtoken";

// Container
import container from "@/infra/container";

// Repositories
import { PrismaSessionsRepository } from "@/infra/database/repositories/prisma-sessions-repository";

// Env
import { env } from "@/infra/env";

// Errors
import { SessionExpiredError } from "@/core/errors/session-expired";
import { UnauthorizedError } from "@/core/errors/unauthorized";

const jwtPayloadSchema = z.object({
  user_id: z.string(),
  iat: z.coerce.number(),
});

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) throw new UnauthorizedError();

    const [, token] = authHeader.split(" ");

    const payload = verify(token, env.JWT_SECRET, { ignoreExpiration: true });

    const { user_id, iat } = jwtPayloadSchema.parse(payload);

    const now = Date.now() / 1000;

    const expired = now - iat > 5 * 60;

    if (expired) {
      const sessionsRepository =
        container.resolve<PrismaSessionsRepository>("sessionsRepository");

      const ONE_HOUR_AGO = new Date(Date.now() - 60 * 60 * 1000);

      const session = await sessionsRepository.search({
        user_id,
        ip: request.ip!,
        agent: request.headers["user-agent"] ?? "not-identified",
        since: ONE_HOUR_AGO,
      });

      if (!session) throw new SessionExpiredError();

      const refresh = sign({ user_id }, env.JWT_SECRET);

      response.header("set-cookie", `token=${refresh}`);
    }

    request.user_id = user_id;

    next();
  } catch (error) {
    next(error);
  }
}
