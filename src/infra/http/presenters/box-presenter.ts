// Entities
import { Box, BoxProps } from "@/core/entities/box";

// Presenters
import { CatalogPresenter } from "@/infra/http/presenters/catalog-presenter";
import { OrderPresenter } from "@/infra/http/presenters/order-presenter";

// Types
import { View } from "@/infra/types/view";

export class BoxPresenter {
  static toHttp(box: Box): View<BoxProps> {
    if (box)
      return {
        id: box.id.value,
        status: box.status,
        verified: box.verified,
        catalog_id: box.catalog_id.value,
        catalog: CatalogPresenter.toHttp(box.catalog),
        orders: Array.from(box.orders.values()).map(OrderPresenter.toHttp),
        created_at: box.created_at,
        updated_at: box.updated_at,
      };
  }
}
