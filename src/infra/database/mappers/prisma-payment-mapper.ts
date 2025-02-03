// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { Payment } from "@/core/entities/payment";

// Libraries
import { Prisma } from "@prisma/client";

type PrismaPayment = Prisma.PaymentGetPayload<{}>;

export class PrismaPaymentMapper {
  static toDomain(raw: PrismaPayment): Payment {
    return Payment.create({
      id: new UUID(raw.id),
      status: raw.status,
      method: raw.method,
      flag: raw.flag,
      expires_at: raw.expires_at,
      bag_id: new UUID(raw.bag_id),
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPrisma(payment: Payment): Prisma.PaymentUncheckedCreateInput {
    return {
      id: payment.id.value,
      status: payment.status,
      method: payment.method,
      flag: payment.flag,
      expires_at: payment.expires_at,
      bag_id: payment.bag_id.value,
      created_at: payment.created_at,
      updated_at: payment.updated_at,
    };
  }
}
