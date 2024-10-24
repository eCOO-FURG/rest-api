// Entities
import { PaymentAggregate } from "@/core/entities/aggregates/payment-aggregate";
import { UUID } from "@/core/entities/aggregates/uuid";

// Libraries
import { Prisma } from "@prisma/client";

// Mappers
import { PrismaBagMergeMapper } from "@/infra/database/mappers/prisma-bag-merge-mapper";

export class PrismaPaymentAggregateMapper {
  static toDomain(
    raw: Prisma.PaymentGetPayload<{
      include: {
        bag: {
          include: {
            customer: true;
            address: true;
            orders: {
              include: {
                offer: {
                  include: {
                    product: true;
                    catalog: {
                      include: { farm: { include: { admin: true } } };
                    };
                  };
                };
              };
            };
            payments: true;
          };
        };
      };
    }>
  ) {
    return PaymentAggregate.create({
      ...raw,
      id: new UUID(raw.id),
      bag: PrismaBagMergeMapper.toDomain(raw.bag),
    });
  }
}
