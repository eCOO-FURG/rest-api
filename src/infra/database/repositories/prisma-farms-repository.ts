// Entities
import { Farm } from "@/core/entities/farm";

// Repositories
import {
  FarmsRepository,
  FarmsRepositoryFindManyWithActiveOfferRequest,
  FarmsRepositorySearchManyWithOrdersRequest,
} from "@/core/repositories/farms-repository";
import { prisma } from "../prisma-service";
import { PrismaFarmMapper } from "../mappers/prisma-farm-mapper";

export class PrismaFarmsRepository implements FarmsRepository {
  async findById(id: string): Promise<Farm | null> {
    const farm = await prisma.farm.findUnique({
      where: {
        id,
      },
    });

    if (!farm) return null;

    return PrismaFarmMapper.toDomain(farm);
  }

  async findByCaf(caf: string): Promise<Farm | null> {
    const farm = await prisma.farm.findUnique({
      where: {
        caf,
      },
    });

    if (!farm) return null;

    return PrismaFarmMapper.toDomain(farm);
  }

  async findByAdminId(admin_id: string): Promise<Farm | null> {
    const farm = await prisma.farm.findUnique({
      where: {
        admin_id,
      },
    });

    if (!farm) return null;

    return PrismaFarmMapper.toDomain(farm);
  }

  async findManyWithActiveOffer({
    cycle_id,
    page,
    product,
    created_at,
  }: FarmsRepositoryFindManyWithActiveOfferRequest): Promise<Farm[]> {
    const skip = (page - 1) * 20;

    const farms = await prisma.farm.findMany({
      where: {
        offers: {
          some: {
            cycle_id,
            product: {
              name: {
                contains: product,
                mode: "insensitive",
              },
            },
            created_at: {
              gte: created_at,
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
      skip,
      take: 20,
    });

    return farms.map((farm) => PrismaFarmMapper.toDomain(farm));
  }

  async create(farm: Farm): Promise<void> {
    const data = PrismaFarmMapper.toPrisma(farm);

    await prisma.farm.create({ data });
  }

  async update(farm: Farm): Promise<void> {
    const data = PrismaFarmMapper.toPrisma(farm);

    await prisma.user.update({
      where: {
        id: farm.id.value,
      },
      data,
    });
  }

  async searchManyWithOrders({
    cycle_id,
    page,
    name,
  }: FarmsRepositorySearchManyWithOrdersRequest): Promise<Farm[]> {
    const skip = (page - 1) * 20;

    const farms = await prisma.farm.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
        offers: {
          some: {
            cycle_id,
            orders: {
              some: {
                amount: {
                  gte: 1,
                },
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
      skip,
      take: 20,
    });

    return farms.map((farm) => PrismaFarmMapper.toDomain(farm));
  }
}
