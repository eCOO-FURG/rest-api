import { ProductAndCategory } from "@/core/entities/aggregates/product-and-category";
import { makeCategory } from "./make-category";
import { makeProduct } from "./make-product";

export function makeProductAndCategory(product = makeProduct()) {
  return ProductAndCategory.create({
    ...product.props,
    category: makeCategory(product.category),
  });
}
