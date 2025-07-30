// Entities
import { Address } from "@/core/entities/address";

export type AddressRepositoryReturnType = "address";

export type AddressEntityOf<T extends AddressRepositoryReturnType> =
  T extends "address" ? Address : never;

export interface AddressesRepositorySearchRequest {
  id?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  postal_code?: string;
  complement?: string | null;
}

export interface AddressesRepository {
  find<T extends AddressRepositoryReturnType>(
    type: T,
    filters: AddressesRepositorySearchRequest,
  ): Promise<AddressEntityOf<T> | null>;
}
