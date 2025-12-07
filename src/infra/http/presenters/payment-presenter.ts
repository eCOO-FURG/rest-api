// Entities
import { Payment, PaymentProps } from "@/core/entities/payment";

// Types
import { View } from "@/infra/types/view";

export class PaymentPresenter {
  static toHttp(payment?: Payment | null): View<PaymentProps> | null {
    if (payment === null) {
      return null;
    }

    if (payment) {
      return {
        id: payment.id.value,
        method: payment.method,
        flag: payment.flag,
        status: payment.status,
        bag_id: payment.bag_id.value,
        created_at: payment.created_at,
        updated_at: payment.updated_at,
      };
    }
  }
}
