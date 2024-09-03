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

export class InMemoryBagsRepository implements BagsRepository {
  items: Bag[] = [];

  constructor(
    private inMemoryUsersRepository: InMemoryUsersRepository,
    private inMemoryOrdersRepository: InMemoryOrdersRepository
  ) {}

  async search<T extends RepositoryResponse = "entity">(
    { id, user, cycle, since }: BagsRepositorySearchRequest,
    type: T
  ): Promise<BagsRepositoryResponse<T> | null> {
    const bag = this.items.find(
      (item) =>
        (!id || item.id.equals(id)) &&
        (!user?.id || item.user_id.equals(user.id)) &&
        (!cycle?.id || item.cycle_id.equals(cycle.id)) &&
        (!since || item.created_at >= since)
    );

    if (!bag) return null;

    if (type === "entity") return bag as BagsRepositoryResponse<T>;

    const _user = await this.inMemoryUsersRepository.findById(
      bag.user_id.value
    );

    if (!_user) return null;

    const aggreagate = BagAggregate.create({
      ...bag.props,
      user: _user,
    });

    if (type === "aggregate") return aggreagate as BagsRepositoryResponse<T>;

    const orders = await this.inMemoryOrdersRepository.searchMany(
      { bag: { id: bag.id.value } },
      "aggregate"
    );

    const merged = BagMerge.create({
      ...aggreagate.props,
      orders,
    });

    return merged as BagsRepositoryResponse<T>;
  }

  async searchMany<T extends RepositoryResponse = "entity">(
    { cycle, name, page, since, status }: BagsRepositorySearchManyRequest,
    type: T
  ): Promise<BagsRepositoryResponse<T>[]> {
    let entities = this.items.filter(
      (item) =>
        (!cycle?.id || item.cycle_id.equals(cycle.id)) &&
        (!since || item.created_at >= since) &&
        (!status || status === item.status) &&
        (!name ||
          (() =>
            this.inMemoryUsersRepository.items.find(
              (user) =>
                (user.first_name.includes(name) ||
                  user.last_name.includes(name)) &&
                user.id.equals(item.user_id)
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

      const aggreagate = BagAggregate.create({
        ...entity.props,
        user,
      });

      aggregates.push(aggreagate);
    }

    const merges: BagMerge[] = [];

    for (const aggregate of aggregates) {
      const orders = await this.inMemoryOrdersRepository.searchMany(
        { bag: { id: aggregate.id.value } },
        "aggregate"
      );

      const merge = BagMerge.create({
        ...aggregate.props,
        orders,
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
