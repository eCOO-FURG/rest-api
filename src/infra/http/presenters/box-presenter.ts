// Entities
import { Box, BoxProps } from "@/core/entities/box";

// Presenters
import { CyclePresenter } from "@/infra/http/presenters/cycle-presenter";
import { OrderPresenter } from "@/infra/http/presenters/order-presenter";
import { FarmPresenter } from "@/infra/http/presenters/farm-presenter";

// Types
import { View } from "@/infra/types/view";

export class BoxPresenter {
  static toHttp(box?: Box | null): View<BoxProps> | null {
    if (box === null) {
      return null;
    }

    if (box) {
      return {
        id: box.id.value,
        status: box.status,
        cycle_id: box.cycle_id.value,
        cycle: CyclePresenter.toHttp(box.cycle),
        farm_id: box.farm_id.value,
        farm: FarmPresenter.toHttp(box.farm),
        orders: box.orders.map(OrderPresenter.toHttp),
        created_at: box.created_at,
        updated_at: box.updated_at,
      };
    }
  }
}
