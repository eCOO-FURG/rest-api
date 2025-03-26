// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { Payment } from "@/core/entities/payment";
import { PaymentEntityOf } from "@/core/repositories/payments-repository";

// Libraries
import { Prisma, Payment as PrismaPayment } from "@prisma/client";

// Types
import { PaymentRepositoryReturnType } from "@/core/repositories/payments-repository";

export class PrismaPaymentMapper {
  static toDomain<T extends PaymentRepositoryReturnType = "payment">(
    raw: PrismaPayment
  ): PaymentEntityOf<T> {
    return Payment.create({
      id: new UUID(raw.id),
      status: raw.status,
      method: raw.method,
      flag: raw.flag,
      bag_id: new UUID(raw.bag_id),
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    }) as PaymentEntityOf<T>;
  }

  static toPrisma(payment: Payment): Prisma.PaymentUncheckedCreateInput {
    return {
      id: payment.id.value,
      status: payment.status,
      method: payment.method,
      flag: payment.flag,
      bag_id: payment.bag_id.value,
      created_at: payment.created_at,
      updated_at: payment.updated_at,
    };
  }
}
