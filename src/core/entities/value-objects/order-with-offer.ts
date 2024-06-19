// Entities
import { OrderProps } from "@/core/entities/order";
import { OfferProps } from "@/core/entities/offer";
import { Product } from "@/core/entities/product";
import { Entity } from "@/core/entities/entity";

interface OfferWithProductProps extends Omit<OfferProps, "product_id"> {
  product: Product;
}

interface OrderWithOfferProps extends Omit<OrderProps, "offer_id"> {
  offer: OfferWithProductProps;
}

export class OrderWithOffer extends Entity<OrderWithOfferProps> {
  get user_id() {
    return this.props.user_id;
  }

  get offer() {
    return this.props.offer;
  }

  get amount() {
    return this.props.amount;
  }

  static create(props: OrderWithOfferProps) {
    const offerWithProduct = new OrderWithOffer(props);
    return offerWithProduct;
  }
}
