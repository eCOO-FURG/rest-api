// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";

export type pricings = "UNIT" | "WEIGHT"

export interface ProductProps extends EntityRequest {
  name: string;
  image: string;
  pricing: pricings;
}

export class Product extends Entity<ProductProps> {
  get name() {
    return this.props.name;
  }

  get image() {
    return this.props.image;
  }

  get pricing() {
    return this.props.pricing;
  }

  static create(props: ProductProps) {
    const product = new Product(props);
    return product;
  }
}
