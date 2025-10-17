// Entities
import { Offer, OfferProps } from "@/core/entities/offer";
import { Product } from "@/core/entities/product";
import { Producer } from "@/core/entities/aggregates/producer";

export interface MerchandiseProps extends OfferProps {
  product: Product;
  farm: Producer;
  fee: number;
}

export class Merchandise extends Offer<MerchandiseProps> {
  get product() {
    return this.props.product;
  }

  get farm() {
    return this.props.farm;
  }

  get total() {
    return this.props.price + this.props.fee;
  }

  get fee() {
    return this.props.fee;
  }

  static create(props: Omit<MerchandiseProps, "fee">) {
    return new Merchandise({
      ...props,
      fee: props.price * (props.farm.fee / 100),
    });
  }
}
