// Entities
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

export class InMemoryBagsRepository implements BagsRepository {
  items: BagEntityOf<BagRepositoryReturnType>[] = [];

  async find<T extends BagRepositoryReturnType>(
    _: T,
    {
      id,
      user,
      address,
      cycle,
      market,
      orders,
      payment,
      statuses,
      withdraw,
      since,
      before,
    }: BagsRepositorySearchRequest,
  ): Promise<BagEntityOf<T> | null> {
    const bag = this.items.find((item) =>
      Boolean(
        (!id || item.id.equals(id)) &&
          (!user?.id || item.customer_id?.equals(user.id)) &&
          (typeof withdraw !== "boolean" ||
            (withdraw && item.address_id) ||
            (!withdraw && !item.address_id)) &&
          Boolean(
            !user?.name ||
              item.customer?.first_name.includes(user.name!) ||
              item.customer?.last_name.includes(user.name!),
          ) &&
          Boolean(
            address === undefined ||
              (address === null && item.address === null) ||
              (address?.id && item.address?.id?.equals(address.id)),
          ) &&
          (!cycle?.id || item.cycle_id?.equals(cycle.id)) &&
          (!market?.id || item.market_id?.equals(market.id)) &&
          (!statuses || statuses.includes(item.status)) &&
          (!since || item.created_at >= since) &&
          (!before || item.created_at <= before) &&
          (!orders?.id || item.orders.some((o) => o.id.equals(orders.id!))) &&
          (!payment?.status || { status: { in: payment!.status } }) &&
          (!payment?.method || { method: { in: payment!.method } }),
      ),
    );

    if (!bag) {
      return null;
    }

    if (orders?.page) {
      bag.orders = paginate(bag.orders, orders.page);
    }

    return bag as BagEntityOf<T>;
  }

  async list<T extends BagRepositoryReturnType>(
    _: T,
    {
      id,
      user,
      address,
      cycle,
      market,
      statuses,
      orders,
      payment,
      withdraw,
      since,
      before,
    }: BagsRepositorySearchRequest,
    page?: number,
  ): Promise<BagEntityOf<T>[]> {
    let bags = this.items.filter((item) =>
      Boolean(
        (!id || item.id.equals(id)) &&
          (!user?.id || item.customer_id?.equals(user.id)) &&
          (typeof withdraw !== "boolean" ||
            (withdraw && item.address_id) ||
            (!withdraw && !item.address_id)) &&
          Boolean(
            !user?.name ||
              item.customer?.first_name.includes(user.name!) ||
              item.customer?.last_name.includes(user.name!),
          ) &&
          Boolean(
            address === undefined ||
              (address === null && item.address_id === null) ||
              (address?.id && item.address_id?.equals(address.id)),
          ) &&
          (!cycle?.id || item.cycle_id?.equals(cycle.id)) &&
          (!market?.id || item.market_id?.equals(market.id)) &&
          (!statuses || statuses.includes(item.status)) &&
          (!since || item.created_at >= since) &&
          (!before || item.created_at <= before) &&
          (!orders?.id || item.orders.some((o) => o.id.equals(orders.id!))) &&
          (!payment?.status || { status: { in: payment!.status } }) &&
          (!payment?.method || { method: { in: payment!.method } }),
      ),
    );

    if (page) {
      bags = paginate(bags, page);
    }

    if (orders?.page) {
      for (const bag of bags) {
        bag.orders = paginate(bag.orders, orders.page);
      }
    }

    return bags as BagEntityOf<T>[];
  }

  async save(bag: Bag): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(bag.id));

    if (index >= 0) {
      this.items[index] = bag;
    } else {
      this.items.push(bag);
    }
  }
}
