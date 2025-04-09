// Entities
import { Category, CategoryProps } from "@/core/entities/category";

// Libs
import { faker } from "@faker-js/faker";

export function makeCategory(props: Partial<CategoryProps> = {}) {
  return Category.create({
    ...props,
    name: props.name ?? faker.animal.fish(),
    image: props.image ?? faker.image.url(),
  });
}
