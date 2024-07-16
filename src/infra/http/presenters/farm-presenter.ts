// Entities
import { Farm } from "@/core/entities/farm";

export class FarmPresenter {
  static toHttp(farm: Farm) {
    return {
      id: farm.id.value,
      name: farm.name,
      caf: farm.caf,
      active: farm.active,
      admin_id: farm.admin_id.value,
      tax: farm.tax,
      created_at: farm.created_at,
      updated_at: farm.updated_at,
    };
  }
}
