import { OrderAggregate } from "@/core/entities/aggregates/order-aggregate";
import { OfferPresenter } from "./offer-presenter";

export class OrderPresenter {
  static toHttp(order: OrderAggregate) {
    return {
      id: order.id.value,
      bag_id: order.bag_id.value,
      offer: OfferPresenter.toHttp(order.offer),
      status: order.status,
      amount: order.amount,
      created_at: order.created_at,
      updated_at: order.updated_at,
    };
  }
}
