// Entities
import { Entity } from "@/core/entities/entity";
import { PaymentProps } from "@/core/entities/payment";
import { BagMerge } from "@/core/entities/merged/bag-merge";
export interface PaymentAggregateProps extends Omit<PaymentProps, "bag_id"> {
  bag: BagMerge;
}

export class PaymentAggregate extends Entity<PaymentAggregateProps> {
  get bag() {
    return this.props.bag;
  }

  get method() {
    return this.props.method;
  }

  get status() {
    return this.props.status;
  }

  get flag() {
    return this.props.flag;
  }

  get expires_at() {
    return this.props.expires_at;
  }

  get expired() {
    return this.expires_at && this.expires_at < new Date();
  }

  static create(props: PaymentAggregateProps) {
    const payment = new PaymentAggregate(props);
    return payment;
  }
}
