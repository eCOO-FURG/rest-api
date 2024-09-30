// Entities
import { Address } from "@/core/entities/address";

export interface AddressesRepositorySearchRequest {
  id?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  complement?: string;
  postal_code?: string;
}

export type AddressesRepositoryResponse = Address;

export interface AddressesRepository {
  search(
    filters: AddressesRepositorySearchRequest
  ): Promise<AddressesRepositoryResponse | null>;
  create(address: Address): Promise<void>;
}
