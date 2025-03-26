// Entities
import { Bag, BagProps } from "@/core/entities/bag";
import { BagAndDetails } from "@/core/entities/aggregates/bag-and-details";

// Presenters
import { UserPresenter } from "@/infra/http/presenters/user-presenter";
import { AddressPresenter } from "@/infra/http/presenters/address-presenter";
import { CyclePresenter } from "@/infra/http/presenters/cycle-presenter";
import { OrderPresenter } from "@/infra/http/presenters/order-presenter";

// Types
import { View } from "@/infra/types/view";

export class BagPresenter {
  static toHttp(bag?: Bag | BagAndDetails): View<BagProps> {
    if (bag instanceof BagAndDetails) {
      return {
        id: bag.id.value,
        status: bag.status,
        total: bag.total,
        subtotal: bag.subtotal,
        paid: bag.paid,
        fee: bag.fee,
        shipping: bag.shipping,
        verified: bag.verified,
        code: bag.code,
        cycle_id: bag.cycle_id.value,
        cycle: CyclePresenter.toHttp(bag.cycle),
        address_id: bag.address_id?.value ?? null,
        address:
          bag.address === null ? null : AddressPresenter.toHttp(bag.address),
        customer_id: bag.customer_id.value,
        customer: UserPresenter.toHttp(bag.customer),
        orders: bag.orders.map(OrderPresenter.toHttp),
        created_at: bag.created_at,
        updated_at: bag.updated_at,
      };
    }

    if (bag instanceof Bag) {
      return {
        id: bag.id.value,
        status: bag.status,
        total: bag.total,
        subtotal: bag.subtotal,
        fee: bag.fee,
        shipping: bag.shipping,
        verified: bag.verified,
        code: bag.code,
        cycle_id: bag.cycle_id.value,
        cycle: CyclePresenter.toHttp(bag.cycle),
        address_id: bag.address_id?.value ?? null,
        address:
          bag.address === null ? null : AddressPresenter.toHttp(bag.address),
        customer_id: bag.customer_id.value,
        customer: UserPresenter.toHttp(bag.customer),
        orders: bag.orders.map(OrderPresenter.toHttp),
        created_at: bag.created_at,
        updated_at: bag.updated_at,
      };
    }
  }
}
