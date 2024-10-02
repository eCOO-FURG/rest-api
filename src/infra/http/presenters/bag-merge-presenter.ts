// Entities
import { BagMerge } from "@/core/entities/merged/bag-merge";

// Presenters
import { UserPresenter } from "@/infra/http/presenters/user-presenter";
import { OrderMergePresenter } from "@/infra/http/presenters/order-merge-presenter";
import { AddressPresenter } from "@/infra/http/presenters/address-presenter";

export class BagMergePresenter {
  static toHttp(bag: BagMerge) {
    return {
      id: bag.id.value,
      status: bag.status,
      cycle_id: bag.cycle_id.value,
      address: AddressPresenter.toHttp(bag.address),
      user: UserPresenter.toHttp(bag.user),
      orders: bag.orders.map((order) => OrderMergePresenter.toHttp(order)),
      created_at: bag.created_at,
      updated_at: bag.updated_at,
    };
  }
}
