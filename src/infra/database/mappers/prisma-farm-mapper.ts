// Libraries
import { Prisma } from "@prisma/client";

// Entities
import { Farm } from "@/core/entities/farm";
import { UUID } from "@/core/entities/aggregates/uuid";

// Mappers
import { PrismaUserMapper } from "@/infra/database/mappers/prisma-user-mapper";

export type PrismaFarm = Prisma.FarmGetPayload<{}> & {
  admin?: Prisma.UserGetPayload<{}>;
};

export class PrismaFarmMapper {
  static toDomain(raw: PrismaFarm): Farm {
    return Farm.create({
      id: new UUID(raw.id),
      status: raw.status,
      name: raw.name,
      tax: raw.tax,
      tally: raw.tally,
      description: raw.description,
      images: new Map(raw.images.map((url: string) => [url, url])),
      admin_id: new UUID(raw.admin_id),
      ...(raw.admin && {
        admin: PrismaUserMapper.toDomain(raw.admin),
      }),
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPrisma(farm: Farm): Prisma.FarmUncheckedCreateInput {
    return {
      id: farm.id.value,
      name: farm.name,
      tally: farm.tally,
      tax: farm.tax,
      description: farm.description,
      status: farm.status,
      admin_id: farm.admin_id.value,
      images: Array.from(farm.images.values()),
      created_at: farm.created_at,
      updated_at: farm.updated_at,
    };
  }
}
