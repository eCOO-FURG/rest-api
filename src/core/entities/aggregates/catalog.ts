// Entities
import { OfferAndProduct } from "@/core/entities/aggregates/offer-and-product";
import { Farm, FarmProps } from "@/core/entities/farm";
import { User } from "@/core/entities/user";

// Types
import { Optional } from "@/core/types/optional";

export interface CatalogProps extends FarmProps {
  admin: User;
  offers: OfferAndProduct[];
}

export class Catalog extends Farm<CatalogProps> {
  get offers() {
    return this.props.offers;
  }

  static create(props: Optional<CatalogProps, "offers">) {
    return new Catalog({
      ...props,
      offers: props.offers ?? [],
    });
  }
}
