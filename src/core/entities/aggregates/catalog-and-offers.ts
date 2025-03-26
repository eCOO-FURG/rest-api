// Entities
import { Catalog, CatalogProps } from "@/core/entities/catalog";
import { FarmAndAdmin } from "@/core/entities/aggregates/farm-and-admin";
import { OfferAndProduct } from "@/core/entities/aggregates/offer-and-product";

export interface CatalogAndOffersProps extends CatalogProps {
  farm: FarmAndAdmin;
  offers: OfferAndProduct[];
}

export class CatalogAndOffers extends Catalog<CatalogAndOffersProps> {
  get farm() {
    return this.props.farm;
  }

  get offers() {
    return this.props.offers;
  }

  static create(props: CatalogAndOffersProps) {
    return new CatalogAndOffers(props);
  }
}
