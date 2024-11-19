// Entities
import { OrderMerge } from "@/core/entities/merged/order-merge";

// Presenters
import { OfferMergePresenter } from "@/infra/http/presenters/offer-merge-presenter";

export class OrderMergePresenter {
  static toHttp(order: OrderMerge) {
    return {
      id: order.id.value,
      status: order.status,
      amount: order.amount,
      bag_id: order.bag_id.value,
      box_id: order.box_id.value,
      offer: OfferMergePresenter.toHttp(order.offer),
      created_at: order.created_at,
      updated_at: order.updated_at,
    };
  }
}
