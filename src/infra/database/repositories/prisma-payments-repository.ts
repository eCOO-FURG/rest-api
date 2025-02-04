// Repositories
import { Payment } from "@/core/entities/payment";
import {
  PaymentsRepository,
  PaymentsRepositorySearchRequest,
} from "@/core/repositories/payments-repository";
import { RepositoryResponse } from "@/core/types/repository-response";

// Services
import { prisma } from "@/infra/database/prisma-service";

// Mappers
import { PrismaPaymentMapper } from "@/infra/database/mappers/prisma-payment-mapper";

export class PrismaPaymentsRepository implements PaymentsRepository {
  async find(
    _: RepositoryResponse,
    { id, bag }: PaymentsRepositorySearchRequest
  ): Promise<Payment | null> {
    const payment = await prisma.payment.findFirst({
      where: { id, bag: { id: bag?.id } },
    });

    if (!payment) return null;

    return PrismaPaymentMapper.toDomain(payment);
  }

  async list(
    _: RepositoryResponse,
    { id, bag }: PaymentsRepositorySearchRequest,
    page?: number
  ): Promise<Payment[]> {
    const payments = await prisma.payment.findMany({
      where: { id, bag: { id: bag?.id } },
      ...(page && { skip: (page - 1) * 20, take: 20 }),
    });

    return payments.map(PrismaPaymentMapper.toDomain);
  }

  async create(payment: Payment): Promise<void> {
    await prisma.payment.create({
      data: PrismaPaymentMapper.toPrisma(payment),
    });
  }

  async update(payment: Payment): Promise<void> {
    await prisma.payment.update({
      where: { id: payment.id.value },
      data: PrismaPaymentMapper.toPrisma(payment),
    });
  }
}
