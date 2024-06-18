// Entities
import { Product } from "@/core/entities/product";
import { OfferProps } from "@/core/entities/offer";
import { Entity } from "@/core/entities/entity";

interface OfferWithProductProps extends Omit<OfferProps, "product_id"> {
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

  get product() {
    return this.props.product;
  }

  get cycle_id() {
    return this.props.cycle_id;
  }

  get delivered_at() {
    return this.props.delivered_at;
  }

  set amount(amount: number) {
    this.props.amount = amount;
  }

  static create(props: OfferWithProductProps) {
    const offerWithProduct = new OfferWithProduct(props);
    return offerWithProduct;
  }
}
