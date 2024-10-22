// Entities
import { Payment } from "@/core/entities/payment";

// Repositories
import {
  PaymentsRepository,
  PaymentsRepositoryResponse,
  PaymentsRepositorySearchManyRequest,
  PaymentsRepositorySearchRequest,
} from "@/core/repositories/payments-repository";

// Utils
import { find } from "@/core/utils/find";
import { filter } from "@/core/utils/filter";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

// Repositories
import { InMemoryBagsRepository } from "@/test/repositories/in-memory-bags-repository";
import { PaymentAggregate } from "@/core/entities/aggregates/payment-aggregate";

export class InMemoryPaymentsRepository implements PaymentsRepository {
  items: Payment[] = [];
  inMemoryBagsRepository: InMemoryBagsRepository | null = null;

  setBagsRepository(bagsRepository: InMemoryBagsRepository) {
    this.inMemoryBagsRepository = bagsRepository;
  }

  async search<T extends RepositoryResponse>(
    { id, bag, status, method }: PaymentsRepositorySearchRequest,
    type: T
  ): Promise<PaymentsRepositoryResponse<T> | null> {
    const payment = await find<Payment>(
      this.items,
      async (item) =>
        (!id || item.id.equals(id)) &&
        (!bag?.id || item.bag_id.equals(bag.id)) &&
        (!status || item.status === status) &&
        (!method || item.method === method)
    );

    if (!payment) return null;

    if (type === "entity") return payment as PaymentsRepositoryResponse<T>;

    const _bag = await this.inMemoryBagsRepository?.search(
      { id: payment.bag_id.value },
      "merged"
    );

    if (!_bag) return null;

    return PaymentAggregate.create({
      ...payment.props,
      bag: _bag,
    }) as PaymentsRepositoryResponse<T>;
  }

  async searchMany<T extends RepositoryResponse>(
    { bag, status, method, page }: PaymentsRepositorySearchManyRequest,
    type: T
  ): Promise<PaymentsRepositoryResponse<T>[]> {
    let payments = await filter(
      this.items,
      async (item) =>
        (!bag?.id || item.bag_id.equals(bag.id)) &&
        (!status || item.status === status) &&
        (!method || item.method === method)
    );

    if (page) {
      const start = (page - 1) * 20;
      const end = start + 20;
      payments = payments.slice(start, end);
    }

    if (type === "entity") return payments as PaymentsRepositoryResponse<T>[];

    const aggregates: PaymentAggregate[] = [];

    for (const payment of payments) {
      const _bag = await this.inMemoryBagsRepository?.search(
        { id: payment.bag_id.value },
        "merged"
      );

      if (!_bag) continue;

      aggregates.push(PaymentAggregate.create({ ...payment.props, bag: _bag }));
    }

    return aggregates as PaymentsRepositoryResponse<T>[];
  }

  async create(payment: Payment): Promise<void> {
    this.items.push(payment);
  }
}
