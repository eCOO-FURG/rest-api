// Libs
import { NextFunction, Request, Response } from "express";

// Container
import container from "@/infra/container";

// Repositories
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";

export async function ensureFarmAdmin(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const user_id = request.user_id;

  const farmsRepository =
    container.resolve<InMemoryFarmsRepository>("farmsRepository");

  const farm = farmsRepository.items.find((item) =>
    item.admin_id.equals(user_id)
  );

  if (!farm) {
    return response
      .status(403)
      .send({ message: "Não é um administrador de agronegócio." });
  }

  request.farm_id = farm.id.value;
  next();
}
