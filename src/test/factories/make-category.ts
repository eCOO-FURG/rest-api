// Entities
import { Category } from "@/core/entities/category";

// Libs
import { faker } from "@faker-js/faker";

export function makeCategory(props: Partial<Category> = {}) {
  return Category.create({
    ...props,
    name: props.name ?? faker.animal.fish(),
  });
}
