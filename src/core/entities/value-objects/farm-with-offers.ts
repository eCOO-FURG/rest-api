import { FarmProps } from "@/core/entities/farm";
import { Offer } from "@/core/entities/offer";
import { Entity } from "@/core/entities/entity";

interface FarmWithOffersProps extends FarmProps {
  offers: Offer[];
}

export class FarmWithOffers extends Entity<FarmWithOffersProps> {
  get name() {
    return this.props.name;
  }

  get caf() {
    return this.props.caf;
  }

  get active() {
    return this.props.active;
  }

  get admin_id() {
    return this.props.admin_id;
  }

  get offers() {
    return this.props.offers;
  }

  static create(props: FarmWithOffersProps) {
    const farmWithOffers = new FarmWithOffers(props);
    return farmWithOffers;
  }
}
