// Entities
import { CatalogAndFarm } from "@/core/entities/aggregates/catalog-and-farm";
import { Offer, OfferProps } from "@/core/entities/offer";
import { Product } from "@/core/entities/product";

// Types
import { Optional } from "@/core/types/optional";

export interface OfferAndDetailsProps extends OfferProps {
  product: Product;
  catalog: CatalogAndFarm;
}

export class OfferAndDetails extends Offer<OfferAndDetailsProps> {
  get product() {
    return this.props.product;
  }

  get catalog() {
    return this.props.catalog;
  }

  static create(props: Optional<OfferAndDetailsProps, "orders">) {
    return new OfferAndDetails({
      ...props,
      orders: props.orders ?? [],
    });
  }
}
