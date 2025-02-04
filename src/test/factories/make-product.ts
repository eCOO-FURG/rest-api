// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { Product } from "@/core/entities/product";

// Libraries
import { faker } from "@faker-js/faker";

export function makeProduct(props: Partial<Product> = {}) {
  return Product.create({
    ...props,
    name: props.name ?? faker.animal.fish(),
    image: props.image ?? faker.internet.emoji(),
    pricing: props.pricing ?? "UNIT",
    category_id: props.category_id ?? new UUID(),
  });
}
