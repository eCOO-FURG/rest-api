// Entities
import { Product } from "@/core/entities/product";
import { Offer } from "@/core/entities/offer";
import { Entity } from "@/core/entities/entity";

interface OfferWithProductProps
  extends Omit<Offer["props"], "product_id"> {
  product: Product;
}

export class OfferWithProduct extends Entity<OfferWithProductProps> {
  get price() {
    return this.props.price;
  }

  get amount() {
    return this.props.amount;
  }

  get description() {
    return this.props.description;
  }

  get farm_id() {
    return this.props.farm_id;
  }

  get cycle_id() {
    return this.props.cycle_id;
  }

  get product() {
    return this.props.product;
  }

  static create(props: OfferWithProductProps) {
    const offerWithProduct = new OfferWithProduct(props);
    return offerWithProduct;
  }
}
