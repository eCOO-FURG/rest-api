import { Offer } from "@/core/entities/offer";
import { OfferWithProduct } from "@/core/entities/value-objects/offer-with-product";

export interface OffersRepositorySearchRequest {
  cycle_id: string;
  product_id: string;
  farm_id: string;
  created_at: Date;
}

export interface OffersRepository {
  findById(id: string): Promise<Offer | null>;
  findByIdWithProduct(id: string): Promise<OfferWithProduct | null>;
  search({
    cycle_id,
    product_id,
    created_at,
  }: OffersRepositorySearchRequest): Promise<Offer | null>;
  create(offer: Offer): Promise<void>;
  update(offer: Offer): Promise<void>;
}
