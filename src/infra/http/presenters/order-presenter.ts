// Entities
import { Order, OrderProps } from "@/core/entities/order";

// Presenters
import { OfferPresenter } from "@/infra/http/presenters/offer-presenter";
import { BagPresenter } from "@/infra/http/presenters/bag-presenter";

// Types
import { View } from "@/infra/types/view";

export class OrderPresenter {
  static toHttp(order?: Order): View<OrderProps> {
    if (order)
      return {
        id: order.id.value,
        bag_id: order.bag_id.value,
        bag: BagPresenter.toHttp(order.bag),
        offer_id: order.offer_id.value,
        offer: OfferPresenter.toHttp(order.offer),
        status: order.status,
        amount: order.amount,
        created_at: order.created_at,
        updated_at: order.updated_at,
      };
  }
}
