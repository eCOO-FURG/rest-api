// Entities
import { Payment } from "@/core/entities/payment";

// Repositories
import {
  PaymentsRepository,
  PaymentsRepositorySearchRequest,
} from "@/core/repositories/payments-repository";

// Utils
import { find } from "@/test/utils/find";
import { filter } from "@/test/utils/filter";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

// Repositories
import { InMemoryBagsRepository } from "@/test/repositories/in-memory-bags-repository";

export class InMemoryPaymentsRepository implements PaymentsRepository {
  items: Payment[] = [];
  inMemoryBagsRepository: InMemoryBagsRepository | null = null;

  setBagsRepository(bagsRepository: InMemoryBagsRepository) {
    this.inMemoryBagsRepository = bagsRepository;
  }

  async find(
    type: RepositoryResponse,
    { id, bag, status, method }: PaymentsRepositorySearchRequest
  ): Promise<Payment | null> {
    const payment = await find<Payment>(
      this.items,
      async (item) =>
        (!id || item.id.equals(id)) &&
        (!bag?.id || item.bag_id.equals(bag.id)) &&
        (!status || item.status === status) &&
        (!method || item.method === method)
    );

    if (!payment) return null;

    if (type === "basic") return payment;

    const _bag = await this.inMemoryBagsRepository?.find("basic", {
      id: payment.bag_id.value,
    });

    if (!_bag) return null;

    return Payment.create({ ...payment.props, bag: _bag });
  }

  async list(
    type: RepositoryResponse,
    { id, bag, status, method }: PaymentsRepositorySearchRequest,
    page?: number
  ): Promise<Payment[]> {
    let payments = await filter<Payment>(
      this.items,
      async (item) =>
        (!id || item.id.equals(id)) &&
        (!bag?.id || item.bag_id.equals(bag.id)) &&
        (!status || item.status === status) &&
        (!method || item.method === method)
    );

    if (page) payments = this.slice(payments, page);

    if (type === "basic") return payments;

    for (const [index, payment] of payments.entries()) {
      const _bag = await this.inMemoryBagsRepository?.find("basic", {
        id: payment.bag_id.value,
      });

      if (!_bag) continue;

      payments[index] = Payment.create({ ...payment.props, bag: _bag });
    }

    return payments;
  }

  async create(payment: Payment): Promise<void> {
    this.items.push(payment);
  }

  async update(payment: Payment): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(payment.id));
    this.items[index] = payment;
  }

  private slice(items: Payment[], page: number, size: number = 20): Payment[] {
    const start = (page - 1) * size;
    const end = start + size;
    return items.slice(start, end);
  }
}
