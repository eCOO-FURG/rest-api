// Entities
import { Product } from "@/core/entities/product";

// Libs
import { faker } from "@faker-js/faker";

export function makeProduct(props: Partial<Product> = {}) {
  return Product.create({
    id: props.id,
    name: props.name ?? faker.animal.fish(),
    image: props.image ?? faker.internet.emoji(),
    pricing: props.pricing ?? "UNIT",
    created_at: props.created_at,
    updated_at: props.updated_at,
    perishable: props.perishable ?? true,
  });
}
