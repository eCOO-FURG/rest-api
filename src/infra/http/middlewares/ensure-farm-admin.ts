// Libs
import { NextFunction, Request, Response } from "express";

// Container
import container from "@/infra/container";

// Repositories
import { PrismaFarmsRepository } from "@/infra/database/repositories/prisma-farms-repository";

export async function ensureFarmAdmin(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const user_id = request.user_id;

  const farmsRepository =
    container.resolve<PrismaFarmsRepository>("farmsRepository");

  const farm = await farmsRepository.search(
    { admin: { id: user_id } },
    "entity"
  );

  if (!farm) {
    return response
      .status(403)
      .send({
        message: "Não é um administrador de agronegócio.",
        code: "not-farm-admin",
      });
  }

  request.farm_id = farm.id.value;
  next();
}
