import { Offer } from "@/core/entities/offer";
import { OfferWithProductAndCycle } from "@/core/entities/value-objects/offer-with-product-and-cycle";

export interface OffersRepositorySearchRequest {
  cycle_id: string;
  product_id: string;
  farm_id: string;
  created_at: Date;
}

export interface OffersRepository {
  findById(id: string): Promise<Offer | null>;
  findByIdWithProductAndCycle(id: string): Promise<OfferWithProductAndCycle | null>;
  search({
    cycle_id,
    product_id,
    created_at,
  }: OffersRepositorySearchRequest): Promise<Offer | null>;
  create(offer: Offer): Promise<void>;
  update(offer: Offer): Promise<void>;
}
