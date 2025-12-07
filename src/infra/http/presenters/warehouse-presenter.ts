// Entities
import { Warehouse } from "@/core/entities/warehouse";

// Types
import { View } from "@/infra/types/view";

export class WarehousePresenter {
  static toHttp(warehouse?: Warehouse | null): View<Warehouse> | null {
    if (warehouse === null) {
      return null;
    }

    if (warehouse) {
      return {
        id: warehouse.id.value,
        CNPJ: warehouse.CNPJ,
        name: warehouse.name,
        email: warehouse.email,
        phone: warehouse.phone,
        manager: warehouse.manager,
        coverage: warehouse.coverage,
        socials: warehouse.socials,
        address: warehouse.address,
        created_at: warehouse.created_at,
        updated_at: warehouse.updated_at,
      };
    }
  }
}
