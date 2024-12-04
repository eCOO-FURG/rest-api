// Entities
import { Address } from "@/core/entities/address";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

export interface AddressesRepositorySearchRequest {
  id?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  postal_code?: string;
  complement?: string | null;
}

export interface AddressesRepository {
  find(
    type: RepositoryResponse,
    filters: AddressesRepositorySearchRequest
  ): Promise<Address | null>;
}
