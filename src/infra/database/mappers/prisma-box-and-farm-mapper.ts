// Entities
import { BoxAndFarm } from "@/core/entities/aggregates/box-and-farm";
import { UUID } from "@/core/entities/aggregates/uuid";

// Libraries
import { Box as PrismaBox } from "@prisma/client";

// Repositories
import { BoxRepositoryReturnType, BoxEntityOf } from "@/core/repositories/boxes-repository";

// Mappers
import {
  PrismaProducer,
  PrismaProducerMapper,
} from "@/infra/database/mappers/prisma-producer-mapper";

export type PrismaBoxAndFarm = PrismaBox & {
  farm: PrismaProducer;
};

export class PrismaBoxAndFarmMapper {
  static toDomain<T extends BoxRepositoryReturnType = "box-and-farm">(
    raw: PrismaBoxAndFarm,
  ): BoxEntityOf<T> {
    return BoxAndFarm.create({
      id: new UUID(raw.id),
      status: raw.status,
      cycle_id: new UUID(raw.cycle_id),
      farm_id: new UUID(raw.farm_id),
      farm: PrismaProducerMapper.toDomain(raw.farm),
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    }) as BoxEntityOf<T>;
  }
}
