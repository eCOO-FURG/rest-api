// Entities
import { Product } from "@/core/entities/product";

// Libs
import { faker } from "@faker-js/faker";

export function makeProduct(props: Partial<Product> = {}) {
  return Product.create({
    ...props,
    name: props.name ?? faker.animal.fish(),
    image: props.image ?? faker.internet.emoji(),
    pricing: props.pricing ?? "UNIT",
  });
}
