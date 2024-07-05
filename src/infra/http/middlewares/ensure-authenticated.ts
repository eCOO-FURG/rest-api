// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { sign, verify } from "jsonwebtoken";

// Container
import container from "@/infra/container";

// Repositories
import { InMemorySessionsRepository } from "@/test/repositories/in-memory-sessions-repository";

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

    if (!authHeader) {
      return response.status(401).send({ message: "Não autorizado." });
    }

    const [, token] = authHeader.split(" ");

    const payload = verify(token, "secret", { ignoreExpiration: true });

    const { user_id, iat } = jwtPayloadSchema.parse(payload);

    const now = Date.now() / 1000;

    const expired = now - iat > 5 * 60;

    if (expired) {
      const sessionsRepository =
        container.resolve<InMemorySessionsRepository>("sessionsRepository");

      const hour = new Date(Date.now() + 60 * 60 * 1000);

      const session = sessionsRepository.items.find(
        (item) =>
          item.user_id.equals(user_id) &&
          item.ip === request.ip &&
          item.agent === (request.headers["user-agent"] ?? "not-identified") &&
          new Date(item.created_at) < hour
      );

      if (!session) {
        return response.status(401).send({ message: "Não autorizado." });
      }

      const refresh = sign({ user_id }, "secret");

      response.header("set-cookie", `token=${refresh}`);
    }

    request.user_id = user_id;
    next();
  } catch (error) {
    return response.status(401).send({ message: "Não autorizado." });
  }
}
