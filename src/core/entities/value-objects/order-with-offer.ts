// Entities
import { Order } from "@/core/entities/order";
import { Offer } from "@/core/entities/offer";
import { Product } from "@/core/entities/product";
import { Entity } from "@/core/entities/entity";
import { Optional } from "@/core/types/optional";

interface OfferWithProductProps extends Omit<Offer["props"], "product_id"> {
  product: Product;
}

interface OrderWithOfferProps
  extends Omit<Optional<Order["props"], "status">, "offer_id"> {
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

  get status() {
    return this.props.status;
  }

  static create(props: OrderWithOfferProps) {
    const offerWithProduct = new OrderWithOffer(props);
    return offerWithProduct;
  }
}
