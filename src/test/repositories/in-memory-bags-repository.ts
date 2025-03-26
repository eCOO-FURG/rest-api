// Entities
import { BagAndDetails } from "@/core/entities/aggregates/bag-and-details";
import { Bag } from "@/core/entities/bag";

// Repositories
import {
  BagsRepository,
  BagsRepositorySearchRequest,
  BagRepositoryReturnType,
  BagEntityOf,
} from "@/core/repositories/bags-repository";

// Utils
import { paginate } from "@/test/utils/paginate";
import { makeAddress } from "@/test/factories/make-address";
import { makePayment } from "@/test/factories/make-payment";
import { BagAndOrders } from "@/core/entities/aggregates/bag-and-orders";
import { makeUser } from "../factories/make-user";
import { makeOfferAndDetails } from "../factories/make-offer-and-details";
import { OrderAndOffer } from "@/core/entities/aggregates/order-and-offer";

export class InMemoryBagsRepository implements BagsRepository {
  items: Bag[] = [];

  async find<T extends BagRepositoryReturnType>(
    type: T,
    {
      id,
      user,
      address,
      cycle,
      orders,
      payment,
      statuses,
      withdraw,
      since,
      before,
    }: BagsRepositorySearchRequest
  ): Promise<BagEntityOf<T> | null> {
    const bag = this.items.find((item) =>
      Boolean(
        (!id || item.id.equals(id)) &&
          (!user?.id || item.customer_id.equals(user.id)) &&
          (typeof withdraw !== "boolean" ||
            (withdraw && item.address_id) ||
            (!withdraw && !item.address_id)) &&
          Boolean(
            !user?.name ||
              item.customer?.first_name.includes(user.name!) ||
              item.customer?.last_name.includes(user.name!)
          ) &&
          Boolean(
            address === undefined ||
              (address === null && item.address === null) ||
              (address?.id && item.address?.id?.equals(address.id))
          ) &&
          (!cycle?.id || item.cycle_id.equals(cycle.id)) &&
          (!statuses || statuses.includes(item.status)) &&
          (!since || item.created_at >= since) &&
          (!before || item.created_at <= before) &&
          (!orders?.id || item.orders.some((o) => o.id.equals(orders.id!))) &&
          (!payment?.status || { status: { in: payment!.status } }) &&
          (!payment?.method || { method: { in: payment!.method } })
      )
    );

    if (!bag) return null;

    if (orders?.page) bag.orders = paginate(bag.orders, orders.page);

    switch (type) {
      default:
        return bag as BagEntityOf<T>;
      case "bag-and-details":
        return BagAndDetails.create({
          ...bag.props,
          address: bag.address ?? makeAddress(),
          payment: makePayment(),
          customer: bag.customer ?? makeUser(),
        }) as BagEntityOf<T>;
      case "bag-and-orders":
        return BagAndOrders.create({
          ...bag.props,
          address: bag.address ?? makeAddress(),
          payment: makePayment(),
          customer: bag.customer ?? makeUser(),
          orders: bag.orders.map((order) =>
            OrderAndOffer.create({
              ...order.props,
              offer: makeOfferAndDetails(order.offer),
            })
          ),
        }) as BagEntityOf<T>;
    }
  }

  async list<T extends BagRepositoryReturnType>(
    type: T,
    {
      id,
      user,
      address,
      cycle,
      statuses,
      orders,
      payment,
      withdraw,
      since,
      before,
    }: BagsRepositorySearchRequest,
    page?: number
  ): Promise<BagEntityOf<T>[]> {
    let bags = this.items.filter((item) =>
      Boolean(
        (!id || item.id.equals(id)) &&
          (!user?.id || item.customer_id.equals(user.id)) &&
          (typeof withdraw !== "boolean" ||
            (withdraw && item.address_id) ||
            (!withdraw && !item.address_id)) &&
          Boolean(
            !user?.name ||
              item.customer?.first_name.includes(user.name!) ||
              item.customer?.last_name.includes(user.name!)
          ) &&
          Boolean(
            address === undefined ||
              (address === null && item.address_id === null) ||
              (address?.id && item.address_id?.equals(address.id))
          ) &&
          (!cycle?.id || item.cycle_id.equals(cycle.id)) &&
          (!statuses || statuses.includes(item.status)) &&
          (!since || item.created_at >= since) &&
          (!before || item.created_at <= before) &&
          (!orders?.id || item.orders.some((o) => o.id.equals(orders.id!))) &&
          (!payment?.status || { status: { in: payment!.status } }) &&
          (!payment?.method || { method: { in: payment!.method } })
      )
    );

    if (page) bags = paginate(bags, page);

    if (orders?.page) {
      for (const bag of bags) bag.orders = paginate(bag.orders, orders.page);
    }

    switch (type) {
      default:
        return bags as BagEntityOf<T>[];
      case "bag-and-details":
        return bags.map(
          (bag) =>
            BagAndDetails.create({
              ...bag.props,
              address: bag.address ?? makeAddress(),
              payment: makePayment(),
              customer: bag.customer ?? makeUser(),
            }) as BagEntityOf<T>
        );
      case "bag-and-orders":
        return bags.map(
          (bag) =>
            BagAndOrders.create({
              ...bag.props,
              address: bag.address ?? makeAddress(),
              payment: makePayment(),
              customer: bag.customer ?? makeUser(),
              orders: bag.orders.map((order) =>
                OrderAndOffer.create({
                  ...order.props,
                  offer: makeOfferAndDetails(order.offer),
                })
              ),
            }) as BagEntityOf<T>
        );
    }
  }

  async create(bag: Bag): Promise<void> {
    this.items.push(bag);
  }

  async update(bag: Bag): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(bag.id));
    this.items[index] = bag;
  }
}
