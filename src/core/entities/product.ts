// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";

export interface ProductProps {
  name: string;
  image: string;
  pricing: "UNIT" | "WEIGHT";
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

  static create(props: ProductProps & EntityRequest) {
    const product = new Product(props);
    return product;
  }
}
