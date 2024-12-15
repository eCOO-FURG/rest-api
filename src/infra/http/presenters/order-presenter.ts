// Entities
import { Order, OrderProps } from "@/core/entities/order";

// Presenters
import { OfferPresenter } from "@/infra/http/presenters/offer-presenter";

// Types
import { View } from "@/infra/types/view";

export class OrderPresenter {
  static toHttp(order?: Order): View<OrderProps> {
    if (order)
      return {
        id: order.id.value,
        status: order.status,
        amount: order.amount,
        bag_id: order.bag_id.value,
        box_id: order.box_id.value,
        offer_id: order.offer_id.value,
        offer: OfferPresenter.toHttp(order.offer),
        created_at: order.created_at,
        updated_at: order.updated_at,
      };
  }
}
