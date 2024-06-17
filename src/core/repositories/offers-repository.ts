import { Offer } from "@/core/entities/offer";

export interface OffersRepositoryFindRequest {
  cycle_id: string;
  product_id: string;
  farm_id: string;
  created_at: Date;
}

export interface OffersRepository {
  create(offer: Offer): Promise<void>;
  find({
    cycle_id,
    product_id,
    created_at,
  }: OffersRepositoryFindRequest): Promise<Offer | null>;
}
