// Entities
import { Farm } from "../entities/farm";

export interface FarmsRepositoryFindManyWithActiveOfferRequest {
  cycle_id: string;
  created_at: Date;
  page: number;
  product?: string;
}

export interface FarmsRepository {
  findById(id: string): Promise<Farm | null>;
  findByCaf(caf: string): Promise<Farm | null>;
  findByAdminId(admin_id: string): Promise<Farm | null>;
  findManyWithActiveOffer({
    cycle_id,
    page,
    product,
    created_at,
  }: FarmsRepositoryFindManyWithActiveOfferRequest): Promise<Farm[]>;
  create(farm: Farm): Promise<void>;
  update(farm: Farm): Promise<void>;
  searchManyFarms(page: number, query?: string | undefined): Promise<Farm[]>
}
