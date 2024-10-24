// Entities
import { PaymentAggregate } from "@/core/entities/aggregates/payment-aggregate";
import { BagMergePresenter } from "./bag-merge-presenter";

export class PaymentPresenter {
  static toHttp(payment: PaymentAggregate) {
    return {
      id: payment.id.value,
      method: payment.method,
      flag: payment.flag,
      status: payment.status,
      bag: BagMergePresenter.toHttp(payment.bag),
      expired: payment.expired,
      expires_at: payment.expires_at,
      created_at: payment.created_at,
      updated_at: payment.updated_at,
    };
  }
}
