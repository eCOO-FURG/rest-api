// Entities
import { Payment, PaymentProps } from "@/core/entities/payment";

// Types
import { View } from "@/infra/types/view";

export class PaymentPresenter {
  static toHttp(payment?: Payment): View<PaymentProps> {
    if (payment)
      return {
        id: payment.id.value,
        method: payment.method,
        flag: payment.flag,
        status: payment.status,
        expired: payment.expired,
        bag_id: payment.bag_id.value,
        expires_at: payment.expires_at,
        created_at: payment.created_at,
        updated_at: payment.updated_at,
      };
  }
}
