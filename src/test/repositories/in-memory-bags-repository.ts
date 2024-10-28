// Entities
import { Bag } from "@/core/entities/bag";
import { BagAggregate } from "@/core/entities/aggregates/bag-aggregate";
import { BagMerge } from "@/core/entities/merged/bag-merge";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

// Repositories
import {
  BagsRepositoryResponse,
  BagsRepository,
  BagsRepositorySearchRequest,
  BagsRepositorySearchManyRequest,
} from "@/core/repositories/bags-repository";
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { InMemoryAddressesRepository } from "@/test/repositories/in-memory-addresses-repository";
import { InMemoryPaymentsRepository } from "@/test/repositories/in-memory-payments-repository";
export class InMemoryBagsRepository implements BagsRepository {
  items: Bag[] = [];

  constructor(
    private inMemoryUsersRepository: InMemoryUsersRepository,
    private inMemoryOrdersRepository: InMemoryOrdersRepository,
    private inMemoryAddressesRepository: InMemoryAddressesRepository,
    private inMemoryPaymentsRepository: InMemoryPaymentsRepository
  ) {}

  async search<T extends RepositoryResponse = "entity">(
    { id, user, cycle, address, since }: BagsRepositorySearchRequest,
    type: T
  ): Promise<BagsRepositoryResponse<T> | null> {
    const bag = this.items.find(
      (item) =>
        (!id || item.id.equals(id)) &&
        (!user?.id || item.user_id.equals(user.id)) &&
        (!cycle?.id || item.cycle_id.equals(cycle.id)) &&
        (address === undefined ||
          (address === null && item.address_id === null) ||
          (address?.id &&
            item.address_id &&
            item.address_id.equals(address.id))) &&
        (!since || item.created_at >= since)
    );

    if (!bag) return null;

    if (type === "entity") return bag as BagsRepositoryResponse<T>;

    const _user = await this.inMemoryUsersRepository.findById(
      bag.user_id.value
    );

    if (!_user) return null;

    const _address = await this.inMemoryAddressesRepository.search({
      id: bag.address_id?.value,
    });

    const aggreagate = BagAggregate.create({
      ...bag.props,
      user: _user,
      address: _address,
    });

    if (type === "aggregate") return aggreagate as BagsRepositoryResponse<T>;

    const orders = await this.inMemoryOrdersRepository.searchMany(
      { bag: { id: bag.id.value } },
      "merged"
    );

    const payments = await this.inMemoryPaymentsRepository.searchMany(
      { bag: { id: bag.id.value } },
      "entity"
    );

    const merged = BagMerge.create({
      ...aggreagate.props,
      orders,
      payments,
    });

    return merged as BagsRepositoryResponse<T>;
  }

  async searchMany<T extends RepositoryResponse = "entity">(
    {
      cycle,
      page,
      since,
      before,
      status,
      user,
    }: BagsRepositorySearchManyRequest,
    type: T
  ): Promise<BagsRepositoryResponse<T>[]> {
    let entities = this.items.filter(
      (item) =>
        (!cycle?.id || item.cycle_id.equals(cycle.id)) &&
        (!since || item.created_at >= since) &&
        (!before || item.created_at <= before) &&
        (!status || status === item.status) &&
        (!user?.id || item.user_id.equals(user.id)) &&
        (!user?.name ||
          (() =>
            this.inMemoryUsersRepository.items.find(
              (_user) =>
                (_user.first_name.includes(user.name!) ||
                  _user.last_name.includes(user.name!)) &&
                _user.id.equals(item.user_id)
            ))())
    );

    if (page) {
      const start = (page - 1) * 20;
      const end = start + 20;
      entities = entities.slice(start, end);
    }

    if (type === "entity") return entities as BagsRepositoryResponse<T>[];

    const aggregates: BagAggregate[] = [];

    for (const entity of entities) {
      const user = await this.inMemoryUsersRepository.findById(
        entity.user_id.value
      );

      if (!user) return [];

      const address = await this.inMemoryAddressesRepository.search({
        id: entity.address_id?.value,
      });

      const aggreagate = BagAggregate.create({
        ...entity.props,
        user,
        address,
      });

      aggregates.push(aggreagate);
    }

    const merges: BagMerge[] = [];

    for (const aggregate of aggregates) {
      const orders = await this.inMemoryOrdersRepository.searchMany(
        { bag: { id: aggregate.id.value } },
        "merged"
      );

      const payments = await this.inMemoryPaymentsRepository.searchMany(
        { bag: { id: aggregate.id.value } },
        "entity"
      );

      const merge = BagMerge.create({
        ...aggregate.props,
        orders,
        payments,
      });

      merges.push(merge);
    }

    return merges as BagsRepositoryResponse<T>[];
  }

  async create(bag: Bag): Promise<void> {
    this.items.push(bag);
  }

  async update(bag: Bag): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(bag.id));

    this.items[index] = bag;
  }
}
