// Entities
import { Offer } from "@/core/entities/offer";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

export interface OffersRepositorySearchRequest {
  id?: string;
  ids?: string[];
  catalog?: { id?: string };
  product?: { id?: string; name?: string };
  since?: Date;
  before?: Date;
}

export interface OffersRepository {
  find(
    type: RepositoryResponse,
    filters: OffersRepositorySearchRequest,
  ): Promise<Offer | null>
  list(
    type: RepositoryResponse,
    filters: OffersRepositorySearchRequest,
    page?: number
  ): Promise<Offer[]>;
  update(offer: Offer): Promise<void>;
}
