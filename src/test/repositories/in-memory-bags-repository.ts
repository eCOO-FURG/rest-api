// Entities
import { Bag } from "@/core/entities/bag";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

// Repositories
import {
  BagsRepository,
  BagsRepositorySearchRequest,
} from "@/core/repositories/bags-repository";
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { InMemoryAddressesRepository } from "@/test/repositories/in-memory-addresses-repository";
import { InMemoryPaymentsRepository } from "@/test/repositories/in-memory-payments-repository";

// Utils
import { find } from "@/test/utils/find";
import { filter } from "@/test/utils/filter";

export class InMemoryBagsRepository implements BagsRepository {
  items: Bag[] = [];

  constructor(
    private inMemoryUsersRepository: InMemoryUsersRepository,
    private inMemoryOrdersRepository: InMemoryOrdersRepository,
    private inMemoryAddressesRepository: InMemoryAddressesRepository,
    private inMemoryPaymentsRepository: InMemoryPaymentsRepository
  ) {}

  async find<T extends RepositoryResponse>(
    type: T,
    {
      id,
      user,
      address,
      cycle,
      statuses,
      since,
      before,
    }: BagsRepositorySearchRequest
  ): Promise<Bag | null> {
    const bag = await find<Bag>(
      this.items,
      async (item) =>
        (!id || item.id.equals(id)) &&
        (!user?.id || item.user_id.equals(user.id)) &&
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
        (!before || item.created_at <= before)
    );

    if (!bag) return null;

    if (type === "basic") return bag;

    const orders = await this.inMemoryOrdersRepository.list("basic", {
      bag: { id: bag.id.value },
    });

    const payments = await this.inMemoryPaymentsRepository.list("basic", {
      bag: { id: bag.id.value },
    });

    bag.orders = orders;
    bag.payments = payments;

    return bag;
  }

  async list<T extends RepositoryResponse>(
    type: T,
    {
      id,
      user,
      address,
      cycle,
      statuses,
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
        (!before || item.created_at <= before)
    );

    if (page) bags = this.slice(bags, page);

    if (type === "basic") return bags;

    for (const [index, bag] of bags.entries()) {
      const _user = await this.inMemoryUsersRepository.find("basic", {
        id: bag.user_id.value,
      });

      if (!_user) continue;

      const address = await this.inMemoryAddressesRepository.find("basic", {
        id: bag.address_id?.value,
      });

      if (!address) continue;

      bags[index] = Bag.create({ ...bag.props, user: _user, address });
    }

    if (type === "aggregate") return bags;

    for (const [index, bag] of bags.entries()) {
      const orders = await this.inMemoryOrdersRepository.list("basic", {
        bag: { id: bag.id.value },
      });

      bags[index] = Bag.create({ ...bag.props, orders });
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

  private slice(items: Bag[], page: number): Bag[] {
    const size = 20;
    const start = (page - 1) * size;
    const end = start + size;
    return items.slice(start, end);
  }
}
