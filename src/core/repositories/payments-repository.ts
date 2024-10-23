// Entities
import { Payment } from "@/core/entities/payment";
import { PaymentAggregate } from "@/core/entities/aggregates/payment-aggregate";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

export interface PaymentsRepositorySearchRequest {
  id?: string;
  bag?: { id?: string };
  status?: "PENDING" | "DONE" | "FAILED";
  method?: "CREDIT" | "DEBIT" | "CASH" | "PIX";
}

export interface PaymentsRepositorySearchManyRequest {
  bag?: { id?: string };
  status?: "PENDING" | "DONE" | "FAILED";
  method?: "CREDIT" | "DEBIT" | "CASH" | "PIX";
  page?: number;
}

export type PaymentsRepositoryResponse<T extends RepositoryResponse> =
  T extends "entity" ? Payment : PaymentAggregate;

export interface PaymentsRepository {
  search<T extends RepositoryResponse>(
    filters: PaymentsRepositorySearchRequest,
    type: T
  ): Promise<PaymentsRepositoryResponse<T> | null>;
  searchMany<T extends RepositoryResponse>(
    filters: PaymentsRepositorySearchManyRequest,
    type: T
  ): Promise<PaymentsRepositoryResponse<T>[]>;
  create(payment: Payment): Promise<void>;
  update(payment: Payment): Promise<void>;
}
