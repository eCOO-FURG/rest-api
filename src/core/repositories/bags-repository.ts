// Entities
import { Bag } from "@/core/entities/bag";
import { PaymentMethod, PaymentStatus } from "@/core/entities/payment";
import { BagAndDetails } from "@/core/entities/aggregates/bag-and-details";
import { BagAndOrders } from "@/core/entities/aggregates/bag-and-orders";

export type BagRepositoryReturnType =
  | "bag"
  | "bag-and-details"
  | "bag-and-orders";

export type BagEntityOf<T extends BagRepositoryReturnType> = T extends "bag"
  ? Bag
  : T extends "bag-and-details"
  ? BagAndDetails
  : T extends "bag-and-orders"
  ? BagAndOrders
  : never;

export interface BagsRepositorySearchRequest {
  id?: string;
  withdraw?: boolean;
  statuses?: Bag["status"][];
  user?: { id?: string; name?: string };
  cycle?: { id?: string };
  address?: { id?: string } | null;
  orders?: { id?: string; page?: number };
  payment?: {
    status?: PaymentStatus[];
    method?: PaymentMethod[];
  } | null;
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
