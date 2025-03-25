// Entities
import { Payment } from "@/core/entities/payment";

export type PaymentRepositoryReturnType = "payment";

export type PaymentEntityOf<T extends PaymentRepositoryReturnType> =
  T extends "payment" ? Payment : never;

export interface PaymentsRepositorySearchRequest {
  id?: string;
  bag?: { id?: string };
}

export interface PaymentsRepository {
  find<T extends PaymentRepositoryReturnType>(
    type: T,
    filters: PaymentsRepositorySearchRequest
  ): Promise<PaymentEntityOf<T> | null>;
  list<T extends PaymentRepositoryReturnType>(
    type: T,
    filters: PaymentsRepositorySearchRequest,
    page?: number
  ): Promise<PaymentEntityOf<T>[]>;
  create(payment: Payment): Promise<void>;
  update(payment: Payment): Promise<void>;
}
