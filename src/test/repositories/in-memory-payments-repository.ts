// Entities
import { Payment } from "@/core/entities/payment";

// Repositories
import {
  PaymentsRepository,
  PaymentsRepositorySearchRequest,
  PaymentRepositoryReturnType,
  PaymentEntityOf,
} from "@/core/repositories/payments-repository";

// Utils
import { paginate } from "@/test/utils/paginate";

export class InMemoryPaymentsRepository implements PaymentsRepository {
  items: Payment[] = [];

  async find<T extends PaymentRepositoryReturnType>(_: T, { id }: PaymentsRepositorySearchRequest): Promise<PaymentEntityOf<T> | null> {
    const payment = this.items.find((item) => Boolean(!id || item.id.equals(id)));

    if (!payment) return null;

    return payment as PaymentEntityOf<T>;
  }

  async list<T extends PaymentRepositoryReturnType>(
    _: T,
    { id }: PaymentsRepositorySearchRequest,
    page?: number,
  ): Promise<PaymentEntityOf<T>[]> {
    let payments = this.items.filter((item) => Boolean(!id || item.id.equals(id)));

    if (page) payments = paginate(payments, page);

    return payments as PaymentEntityOf<T>[];
  }

  async create(payment: Payment): Promise<void> {
    this.items.push(payment);
  }

  async update(payment: Payment): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(payment.id));
    this.items[index] = payment;
  }
}
