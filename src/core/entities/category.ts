// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";

export interface CategoryProps extends EntityRequest {
  name: string;
  image: string;
}

export class Category<Props extends CategoryProps = CategoryProps> extends Entity<Props> {
  get name() {
    return this.props.name;
  }

  set name(value: string) {
    this.props.name = value;
  }

  get image() {
    return this.props.image;
  }

  set image(value: string) {
    this.props.image = value;
  }

  static create(props: CategoryProps) {
    const category = new Category(props);
    return category;
  }
}
