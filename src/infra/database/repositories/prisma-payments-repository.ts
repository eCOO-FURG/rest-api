// Repositories
import { Payment } from "@/core/entities/payment";
import {
  PaymentRepositoryReturnType,
  PaymentEntityOf,
  PaymentsRepository,
  PaymentsRepositorySearchRequest,
} from "@/core/repositories/payments-repository";

// Services
import { prisma } from "@/infra/database/prisma-service";

// Mappers
import { PrismaPaymentMapper } from "@/infra/database/mappers/prisma-payment-mapper";

export class PrismaPaymentsRepository implements PaymentsRepository {
  async find<T extends PaymentRepositoryReturnType>(
    _: T,
    { id }: PaymentsRepositorySearchRequest
  ): Promise<PaymentEntityOf<T> | null> {
    const payment = await prisma.payment.findFirst({
      where: { id },
    });

    if (!payment) return null;

    return PrismaPaymentMapper.toDomain<T>(payment);
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
