// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { Category } from "@/core/entities/category";
import { Entity, EntityRequest } from "@/core/entities/entity";

// Types
import { Optional } from "@/core/types/optional";

export const PRODUCT_PRICINGS = ["UNIT", "WEIGHT"] as const;

export interface ProductProps extends EntityRequest {
  name: string;
  image: string;
  archived: boolean;
  pricing: (typeof PRODUCT_PRICINGS)[number];

  category_id: UUID;
  category?: Category;
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

  set pricing(value: ProductProps["pricing"]) {
    this.props.pricing = value;
  }

  set archived(value: boolean) {
    this.props.archived = value;
  }

  unarchive() {
    this.props.archived = false;
    this.touch();
  }

  get category_id() {
    return this.props.category_id;
  }

  get category() {
    return this.props.category;
  }

  static create(props: Optional<ProductProps, "archived">) {
    const product = new Product({
      ...props,
      archived: props.archived ?? false,
    });
    return product;
  }
}
