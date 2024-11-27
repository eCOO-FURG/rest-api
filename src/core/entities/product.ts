// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";

export interface ProductProps extends EntityRequest {
  name: string;
  image: string;
  pricing: "UNIT" | "WEIGHT";
  perishable: boolean;

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

  get perishable() {
    return this.props.perishable;
  }

  static create(props: ProductProps) {
    const product = new Product(props);
    return product;
  }
}
