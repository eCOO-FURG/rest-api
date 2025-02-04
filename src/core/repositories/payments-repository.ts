// Entities
import { Payment } from "@/core/entities/payment";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

export interface PaymentsRepositorySearchRequest {
  id?: string;
  bag?: {
    id?: string;
  };
}

export interface PaymentsRepository {
  find(
    type: RepositoryResponse,
    filters: PaymentsRepositorySearchRequest
  ): Promise<Payment | null>;
  list(
    type: RepositoryResponse,
    filters: PaymentsRepositorySearchRequest,
    page?: number
  ): Promise<Payment[]>;
  create(payment: Payment): Promise<void>;
  update(payment: Payment): Promise<void>;
}
