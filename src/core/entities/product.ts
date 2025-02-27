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
  perishable: boolean;

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

  get perishable() {
    return this.props.perishable;
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

  set perishable(value: boolean) {
    this.props.perishable = value;
  }

  unarchive() {
    this.props.archived = false;
    this.touch();
  }

  get category_id() {
    return this.props.category_id;
  }

  set category_id(value: UUID) {
    this.props.category_id = value;
  }

  get category() {
    return this.props.category;
  }

  static create(props: Optional<ProductProps, "archived" | "perishable">) {
    const product = new Product({
      ...props,
      archived: props.archived ?? false,
      perishable: props.perishable ?? false,
    });
    return product;
  }
}
