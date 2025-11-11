// Entities
import { Category, CategoryProps } from "@/core/entities/category";
import { Merchandise } from "@/core/entities/aggregates/merchandise";

export interface CategoryAndOffersProps extends CategoryProps {
  offers: Merchandise[];
}

export class CategoryAndOffers extends Category<CategoryAndOffersProps> {
  get offers() {
    return this.props.offers;
  }

  static create(props: CategoryAndOffersProps) {
    return new CategoryAndOffers(props);
  }
}
