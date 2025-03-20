// Libraries
import { Prisma, Farm as PrismaFarm } from "@prisma/client";

// Entities
import { Farm } from "@/core/entities/farm";
import { UUID } from "@/core/entities/aggregates/uuid";
import {
  FarmEntityOf,
  FarmRepositoryReturnType,
} from "@/core/repositories/farms-repository";

export class PrismaFarmMapper {
  static toDomain<T extends FarmRepositoryReturnType>(
    raw: PrismaFarm
  ): FarmEntityOf<T> {
    return Farm.create({
      id: new UUID(raw.id),
      status: raw.status,
      name: raw.name,
      fee: raw.fee,
      tally: raw.tally,
      description: raw.description,
      photo: raw.photo,
      images: raw.images,
      admin_id: new UUID(raw.admin_id),
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    }) as FarmEntityOf<T>;
  }

  static toPrisma(farm: Farm): Prisma.FarmUncheckedCreateInput {
    return {
      id: farm.id.value,
      name: farm.name,
      tally: farm.tally,
      fee: farm.fee,
      description: farm.description,
      status: farm.status,
      photo: farm.photo,
      images: farm.images,
      admin_id: farm.admin_id.value,
      created_at: farm.created_at,
      updated_at: farm.updated_at,
    };
  }
}
