// Entities
import { Bag, BagProps } from "@/core/entities/bag";

// Presenters
import { UserPresenter } from "@/infra/http/presenters/user-presenter";
import { AddressPresenter } from "@/infra/http/presenters/address-presenter";
import { CyclePresenter } from "@/infra/http/presenters/cycle-presenter";
import { PaymentPresenter } from "@/infra/http/presenters/payment-presenter";
import { OrderPresenter } from "@/infra/http/presenters/order-presenter";

// Types
import { View } from "@/infra/types/view";

export class BagPresenter {
  static toHttp(bag?: Bag): View<BagProps> {
    if (bag)
      return {
        id: bag.id.value,
        status: bag.status,
        paid: bag.paid(),
        open: bag.open(),
        price: bag.price(),
        code: bag.code,
        cycle_id: bag.cycle_id.value,
        cycle: CyclePresenter.toHttp(bag.cycle),
        address_id: bag.address_id,
        address: AddressPresenter.toHttp(bag.address),
        user_id: bag.user_id,
        user: UserPresenter.toHttp(bag.user),
        orders: Array.from(bag.orders.values()).map(OrderPresenter.toHttp),
        payments: Array.from(bag.payments.values()).map(
          PaymentPresenter.toHttp
        ),
        created_at: bag.created_at,
        updated_at: bag.updated_at,
      };
  }
}
