// Entities
import { Product, ProductProps } from "@/core/entities/product";
import { Category } from "@/core/entities/category";

export interface ProductAndCategoryProps extends ProductProps {
  category: Category;
}

export class ProductAndCategory extends Product {
  get category() {
    return this.props.category;
  }

  static create(props: ProductAndCategoryProps) {
    return new ProductAndCategory(props);
  }
}
