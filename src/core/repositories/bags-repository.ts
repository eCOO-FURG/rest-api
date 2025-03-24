// Entities
import { Bag } from "@/core/entities/bag";
import { PaymentMethod, PaymentStatus } from "@/core/entities/payment";
import { BagAndCustomer } from "@/core/entities/aggregates/bag-and-customer";

export type BagRepositoryReturnType = "bag" | "bag-and-details";

export type BagEntityOf<T extends BagRepositoryReturnType> = T extends "bag"
  ? Bag
  : T extends "bag-and-details"
  ? BagAndCustomer
  : never;

export interface BagsRepositorySearchRequest {
  id?: string;
  withdraw?: boolean;
  statuses?: Bag["status"][];
  user?: { id?: string; name?: string };
  cycle?: { id?: string };
  address?: { id?: string } | null;
  orders?: { id?: string; page?: number };
  payments?: {
    id?: string;
    status?: PaymentStatus[];
    method?: PaymentMethod[];
    page?: number;
  };
  since?: Date;
  before?: Date;
}

export interface BagsRepository {
  find<T extends BagRepositoryReturnType>(
    type: T,
    filters: BagsRepositorySearchRequest
  ): Promise<BagEntityOf<T> | null>;
  list<T extends BagRepositoryReturnType>(
    type: T,
    filters: BagsRepositorySearchRequest,
    page?: number
  ): Promise<BagEntityOf<T>[]>;
  create(bag: Bag): Promise<void>;
  update(bag: Bag): Promise<void>;
}
