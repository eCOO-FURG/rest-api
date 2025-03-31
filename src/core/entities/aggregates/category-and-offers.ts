// Entities
import { Category, CategoryProps } from "@/core/entities/category";
import { OfferAndDetails } from "@/core/entities/aggregates/offer-and-details";

export interface CategoryAndOffersProps extends CategoryProps {
  offers: OfferAndDetails[];
}

export class CategoryAndOffers extends Category<CategoryAndOffersProps> {
  get offers() {
    return this.props.offers;
  }

  static create(props: CategoryAndOffersProps) {
    return new CategoryAndOffers(props);
  }
}
