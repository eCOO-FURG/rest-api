// Entities
import { Payment } from "@/core/entities/payment";

// Repositories
import {
  PaymentsRepository,
  PaymentsRepositoryResponse,
  PaymentsRepositorySearchManyRequest,
  PaymentsRepositorySearchRequest,
} from "@/core/repositories/payments-repository";

// Services
import { prisma } from "@/infra/database/prisma-service";

// Mappers
import { PrismaPaymentMapper } from "@/infra/database/mappers/prisma-payment-mapper";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";
import { PrismaPaymentAggregateMapper } from "@/infra/database/mappers/prisma-payment-aggregate-mapper";

export class PrismaPaymentsRepository implements PaymentsRepository {
  async search<T extends RepositoryResponse>(
    { id, bag, status, method }: PaymentsRepositorySearchRequest,
    type: T
  ): Promise<PaymentsRepositoryResponse<T> | null> {
    if (type === "entity") {
      const found = await prisma.payment.findFirst({
        where: { id, status, method, bag: { id: bag?.id } },
      });

      if (!found) return null;

      return PrismaPaymentMapper.toDomain(
        found
      ) as PaymentsRepositoryResponse<T>;
    }

    const found = await prisma.payment.findFirst({
      where: { id, status, method, bag: { id: bag?.id } },
      include: {
        bag: {
          include: {
            customer: true,
            address: true,
            orders: { include: { offer: true } },
            payments: true,
          },
        },
      },
    });

    if (!found) return null;

    return PrismaPaymentAggregateMapper.toDomain(
      found
    ) as PaymentsRepositoryResponse<T>;
  }

  async searchMany<T extends RepositoryResponse>(
    { bag, status, method, page }: PaymentsRepositorySearchManyRequest,
    type: T
  ): Promise<PaymentsRepositoryResponse<T>[]> {
    if (type === "entity") {
      const found = await prisma.payment.findMany({
        where: { status, method, bag: { id: bag?.id } },
      });

      return found.map((payment) =>
        PrismaPaymentMapper.toDomain(payment)
      ) as PaymentsRepositoryResponse<T>[];
    }

    const found = await prisma.payment.findMany({
      where: { status, method, bag: { id: bag?.id } },
      include: {
        bag: {
          include: {
            customer: true,
            address: true,
            orders: { include: { offer: true } },
            payments: true,
          },
        },
      },
      ...(page && { skip: (page - 1) * 20, take: 20 }),
    });

    return found.map((payment) =>
      PrismaPaymentAggregateMapper.toDomain(payment)
    ) as PaymentsRepositoryResponse<T>[];
  }

  async create(payment: Payment) {
    await prisma.payment.create({
      data: PrismaPaymentMapper.toPrisma(payment),
    });
  }

  async update(payment: Payment) {
    await prisma.payment.update({
      where: { id: payment.id.value },
      data: PrismaPaymentMapper.toPrisma(payment),
    });
  }
}
