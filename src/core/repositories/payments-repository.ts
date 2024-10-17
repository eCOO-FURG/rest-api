// Entities
import { Payment } from "@/core/entities/payment";

export interface PaymentsRepositorySearchRequest {
  id?: string;
  bag?: {
    id?: string;
  };
  status?: "PENDING" | "DONE" | "FAILED";
  method?: "CARD" | "CASH" | "PIX";
}

export interface PaymentsRepositorySearchManyRequest {
  bag?: {
    id?: string;
  };
  status?: "PENDING" | "DONE" | "FAILED";
  method?: "CARD" | "CASH" | "PIX";
  page?: number;
}

export interface PaymentsRepository {
  search(filters: PaymentsRepositorySearchRequest): Promise<Payment | null>;
  searchMany(filters: PaymentsRepositorySearchManyRequest): Promise<Payment[]>;
  create(payment: Payment): Promise<void>;
}
