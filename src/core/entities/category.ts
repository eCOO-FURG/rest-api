// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";

export interface CategoryProps extends EntityRequest {
  name: string;
}

export class Category extends Entity<CategoryProps> {
  get name() {
    return this.props.name;
  }

  set name(value: string) {
    this.props.name = value;
  }

  static create(props: CategoryProps) {
    const category = new Category(props);
    return category;
  }
}
