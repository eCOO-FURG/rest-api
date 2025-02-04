// Entities
import { Payment } from "@/core/entities/payment";

// Repositories
import {
  PaymentsRepository,
  PaymentsRepositorySearchRequest,
} from "@/core/repositories/payments-repository";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

// Utils
import { find } from "@/test/utils/find";
import { filter } from "@/test/utils/filter";
import { paginate } from "@/test/utils/paginate";

export class InMemoryPaymentsRepository implements PaymentsRepository {
  items: Payment[] = [];

  async find(
    _: RepositoryResponse,
    { id }: PaymentsRepositorySearchRequest
  ): Promise<Payment | null> {
    const payment = await find<Payment>(
      this.items,
      async (item) => !id || item.id.equals(id)
    );

    return payment ?? null;
  }

  async list(
    _: RepositoryResponse,
    { id }: PaymentsRepositorySearchRequest,
    page?: number
  ): Promise<Payment[]> {
    let payments = await filter<Payment>(
      this.items,
      async (item) => !id || item.id.equals(id)
    );

    if (page) payments = paginate(payments, page);

    return payments;
  }

  async create(payment: Payment): Promise<void> {
    this.items.push(payment);
  }

  async update(payment: Payment): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(payment.id));
    this.items[index] = payment;
  }
}
