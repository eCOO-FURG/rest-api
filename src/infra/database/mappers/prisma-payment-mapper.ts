import { UUID } from "@/core/entities/aggregates/uuid";
import { Payment } from "@/core/entities/payment";

import { Prisma, Payment as PrismaPayment } from "@prisma/client";

export class PrismaPaymentMapper {
  static toDomain(raw: PrismaPayment) {
    return Payment.create({
      ...raw,
      id: new UUID(raw.id),
      bag_id: new UUID(raw.bag_id),
    });
  }

  static toPrisma(payment: Payment): Prisma.PaymentUncheckedCreateInput {
    return {
      ...payment.props,
      id: payment.id.value,
      bag_id: payment.bag_id.value,
    };
  }
}
