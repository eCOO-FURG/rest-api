// Entities
import { Farm } from "../entities/farm";
import { OrderWithOffer } from "../entities/value-objects/order-with-offer";

export interface FarmsRepositoryFindManyWithActiveOfferRequest {
  cycle_id: string;
  created_at: Date;
  page: number;
  product?: string;
}

export interface FarmsRepositorySearchManyWithOrdersRequest{
  cycle_id: string;
  page: number;
  name?: string
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
  searchOrders(params: {
    farm_id: string;
    cycle_id: string;
    created_at: Date;
  }): Promise<OrderWithOffer[]>;
  create(farm: Farm): Promise<void>;
  update(farm: Farm): Promise<void>;
  searchManyWithOrders({ cycle_id, page, name }: FarmsRepositorySearchManyWithOrdersRequest): Promise<Farm[]>
}
