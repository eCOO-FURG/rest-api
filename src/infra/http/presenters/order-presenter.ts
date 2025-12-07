// Entities
import { Order, OrderProps } from "@/core/entities/order";

// Presenters
import { OfferPresenter } from "@/infra/http/presenters/offer-presenter";
import { BoxPresenter } from "@/infra/http/presenters/box-presenter";

// Types
import { View } from "@/infra/types/view";

export class OrderPresenter {
  static toHttp(order?: Order | null): View<OrderProps> | null {
    if (order === null) {
      return null;
    }

    if (order) {
      return {
        id: order.id.value,
        status: order.status,
        fee: order.fee,
        amount: order.amount,
        subtotal: order.subtotal,
        total: order.total,
        bag_id: order.bag_id.value,
        box_id: order.box_id ? order.box_id.value : null,
        box: BoxPresenter.toHttp(order.box),
        offer_id: order.offer_id.value,
        offer: OfferPresenter.toHttp(order.offer),
        created_at: order.created_at,
        updated_at: order.updated_at,
      };
    }
  }
}
