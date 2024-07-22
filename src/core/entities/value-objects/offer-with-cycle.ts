import { Cycle } from "../cycle";
import { Entity } from "../entity";
import { OfferProps } from "../offer";

interface OfferWithCycleProps extends Omit<OfferProps, "cycle_id"> {
  cycle: Cycle
}

export class OfferWithCycle extends Entity<OfferWithCycleProps> {
  get price() {
    return this.props.price;
  }

  get amount() {
    return this.props.amount;
  }

  get description() {
    return this.props.description;
  }

  get farm_id() {
    return this.props.farm_id;
  }

  get product_id() {
    return this.props.product_id;
  }

  get cycle() {
    return this.props.cycle;
  }

  static create(props: OfferWithCycleProps) {
    const offerWithCycle = new OfferWithCycle(props);
    return offerWithCycle;
  }
}