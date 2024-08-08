import { OrderAggregate } from "@/core/entities/value-objects/order-aggregate";

export class OrderAggregatePresenter {
  static toHttp(order: OrderAggregate) {
    return {
      id: order.id.value,
      bag_id: order.bag_id.value,
      status: order.status,
      created_at: order.created_at,
      updated_at: order.updated_at,
      offer: {
        id: order.offer.id.value,
        farm_id: order.offer.farm_id.value,
        cycle_id: order.offer.cycle_id.value,
        price: order.offer.price,
        amount: order.offer.amount,
        description: order.offer.description,
        created_at: order.offer.created_at,
        updated_at: order.offer.updated_at,
        product: {
          id: order.offer.product.id.value,
          name: order.offer.product.name,
          pricing: order.offer.product.pricing,
          image: order.offer.product.image,
          created_at: order.offer.product.created_at,
          updated_at: order.offer.product.updated_at,
        },
      },
    };
  }
}
