// Entities
import { Payment } from "@/core/entities/payment";

// Repositories
import {
  PaymentsRepository,
  PaymentsRepositorySearchManyRequest,
  PaymentsRepositorySearchRequest,
} from "@/core/repositories/payments-repository";

// Utils
import { find } from "@/core/utils/find";
import { filter } from "@/core/utils/filter";

export class InMemoryPaymentsRepository implements PaymentsRepository {
  items: Payment[] = [];

  async search({
    id,
    bag,
    status,
    method,
  }: PaymentsRepositorySearchRequest): Promise<Payment | null> {
    const payment = await find<Payment>(
      this.items,
      async (item) =>
        (!id || item.id.equals(id)) &&
        (!bag?.id || item.bag_id.equals(bag.id)) &&
        (!status || item.status === status) &&
        (!method || item.method === method)
    );

    if (!payment) return null;

    return payment;
  }

  async searchMany({
    bag,
    status,
    method,
    page,
  }: PaymentsRepositorySearchManyRequest): Promise<Payment[]> {
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

    return payments;
  }

  async create(payment: Payment): Promise<void> {
    this.items.push(payment);
  }
}
