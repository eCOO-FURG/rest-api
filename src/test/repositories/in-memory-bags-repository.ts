// Entities
import { Bag } from "@/core/entities/bag";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

// Repositories
import {
  BagsRepository,
  BagsRepositorySearchRequest,
} from "@/core/repositories/bags-repository";

// Utils
import { find } from "@/test/utils/find";
import { filter } from "@/test/utils/filter";
import { paginate } from "@/test/utils/paginate";

export class InMemoryBagsRepository implements BagsRepository {
  items: Bag[] = [];

  async find<T extends RepositoryResponse>(
    _: T,
    {
      id,
      user,
      address,
      cycle,
      orders,
      payments,
      statuses,
      withdraw,
      since,
      before,
    }: BagsRepositorySearchRequest
  ): Promise<Bag | null> {
    const bag = await find<Bag>(
      this.items,
      async (item) =>
        (!id || item.id.equals(id)) &&
        (!user?.id || item.user_id.equals(user.id)) &&
        (!withdraw || item.address_id === null) &&
        Boolean(
          !user?.name ||
            item.user?.first_name.includes(user.name!) ||
            item.user?.last_name.includes(user.name!)
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
        (!orders?.id || item.orders.has(orders.id)) &&
        (!payments?.id || item.payments.has(payments.id))
    );

    if (!bag) return null;

    if (orders?.page) bag.orders = paginate(bag.orders, orders.page);
    if (payments?.page) bag.payments = paginate(bag.payments, payments.page);

    return bag;
  }

  async list<T extends RepositoryResponse>(
    _: T,
    {
      id,
      user,
      address,
      cycle,
      statuses,
      orders,
      payments,
      withdraw,
      since,
      before,
    }: BagsRepositorySearchRequest,
    page?: number
  ): Promise<Bag[]> {
    let bags = await filter<Bag>(
      this.items,
      async (item) =>
        (!id || item.id.equals(id)) &&
        (!user?.id || item.user_id.equals(user.id)) &&
        (!withdraw || item.address_id === null) &&
        Boolean(
          !user?.name ||
            item.user?.first_name.includes(user.name!) ||
            item.user?.last_name.includes(user.name!)
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
        (!orders?.id || item.orders.has(orders.id)) &&
        (!payments?.id || item.payments.has(payments.id))
    );

    if (page) bags = paginate(bags, page);

    if (orders?.page) {
      for (const bag of bags) bag.orders = paginate(bag.orders, orders.page);
    }

    if (payments?.page) {
      for (const bag of bags)
        bag.payments = paginate(bag.payments, payments.page);
    }

    return bags;
  }

  async create(bag: Bag): Promise<void> {
    this.items.push(bag);
  }

  async update(bag: Bag): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(bag.id));
    this.items[index] = bag;
  }
}
