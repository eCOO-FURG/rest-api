// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";

export type pricings = "UNIT" | "WEIGHT"

export interface ProductProps extends EntityRequest {
  name: string;
  image: string;
  pricing: pricings;
  archived: boolean
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

  get archived() {
    return this.props.archived;
  }

  set name(value: string) {
    this.props.name = value;
  }

  set image(value: string) {
    this.props.image = value;
  }

  set pricing(value: pricings) {
    this.props.pricing = value;
  }

  set archived(value: boolean) {
    this.props.archived = value;
  }

  unarchive() {
    this.props.archived = false;
  }

  public touch() {
    this.props.updated_at = new Date();
  }

  static create(props: ProductProps) {
    const product = new Product(props);
    return product;
  }
}