// Entities
import { Product } from "@/core/entities/product";
import { Offer } from "@/core/entities/offer";
import { Entity } from "@/core/entities/entity";
import { Cycle } from "@/core/entities/cycle";

interface OfferWithProductAndCycleProps
  extends Omit<Offer["props"], "product_id" | "cycle_id"> {
  product: Product;
  cycle: Cycle;
}

export class OfferWithProductAndCycle extends Entity<OfferWithProductAndCycleProps> {
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

  get product() {
    return this.props.product;
  }

  get cycle() {
    return this.props.cycle;
  }

  static create(props: OfferWithProductAndCycleProps) {
    const offerWithProduct = new OfferWithProductAndCycle(props);
    return offerWithProduct;
  }
}
