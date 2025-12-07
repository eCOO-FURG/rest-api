// Entities
import { Bag, BagProps } from "@/core/entities/bag";
import { BagAndDetails } from "@/core/entities/aggregates/bag-and-details";
import { BagAndOrders } from "@/core/entities/aggregates/bag-and-orders";

// Presenters
import { UserPresenter } from "@/infra/http/presenters/user-presenter";
import { AddressPresenter } from "@/infra/http/presenters/address-presenter";
import { CyclePresenter } from "@/infra/http/presenters/cycle-presenter";
import { OrderPresenter } from "@/infra/http/presenters/order-presenter";
import { MarketPresenter } from "@/infra/http/presenters/market-presenter";

// Types
import { View } from "@/infra/types/view";

export class BagPresenter {
  static toHttp(bag?: Bag | null): View<BagProps> | null {
    if (bag === null) {
      return null;
    }

    if (bag instanceof BagAndDetails || bag instanceof BagAndOrders) {
      return {
        id: bag.id.value,
        status: bag.status,
        total: bag.total,
        subtotal: bag.subtotal,
        fee: bag.fee,
        shipping: bag.shipping,
        code: bag.code,
        comment: bag.comment,
        payment: bag.payment,
        paid: bag.paid,
        cycle_id: bag.cycle_id ? bag.cycle_id.value : null,
        cycle: CyclePresenter.toHttp(bag.cycle),
        market_id: bag.market_id ? bag.market_id.value : null,
        market: MarketPresenter.toHttp(bag.market),
        address_id: bag.address_id ? bag.address_id.value : null,
        address: bag.address === null ? null : AddressPresenter.toHttp(bag.address),
        customer_id: bag.customer_id ? bag.customer_id.value : null,
        customer: UserPresenter.toHttp(bag.customer),
        orders: bag.orders.map(OrderPresenter.toHttp),
        created_at: bag.created_at,
        updated_at: bag.updated_at,
      };
    }

    if (bag) {
      return {
        id: bag.id.value,
        status: bag.status,
        total: bag.total,
        subtotal: bag.subtotal,
        fee: bag.fee,
        shipping: bag.shipping,
        code: bag.code,
        comment: bag.comment,
        cycle_id: bag.cycle_id ? bag.cycle_id.value : null,
        cycle: CyclePresenter.toHttp(bag.cycle),
        market_id: bag.market_id ? bag.market_id.value : null,
        market: MarketPresenter.toHttp(bag.market),
        address_id: bag.address_id ? bag.address_id.value : null,
        address: bag.address === null ? null : AddressPresenter.toHttp(bag.address),
        customer_id: bag.customer_id ? bag.customer_id.value : null,
        customer: UserPresenter.toHttp(bag.customer),
        orders: bag.orders.map(OrderPresenter.toHttp),
        created_at: bag.created_at,
        updated_at: bag.updated_at,
      };
    }
  }
}
