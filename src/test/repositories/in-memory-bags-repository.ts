import { Bag } from "@/core/entities/bag";
import { BagAggregate } from "@/core/entities/value-objects/bag-aggregate";
import {
  BagsRepositoryResponse,
  BagsRepository,
  BagsRepositorySearchRequest,
  BagsRepositorySearchManyRequest,
} from "@/core/repositories/bags-repository";
import { InMemoryUsersRepository } from "./in-memory-users-repository";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

export class InMemoryBagsRepository implements BagsRepository {
  items: Bag[] = [];

  constructor(private inMemoryUsersRepository: InMemoryUsersRepository) {}

  async findById<T extends RepositoryResponse = "entity">(
    id: string,
    type = "entity"
  ): Promise<BagsRepositoryResponse<T> | null> {
    const bag = this.items.find((item) => item.id.equals(id));

    if (!bag) return null;

    if (type === "entity") return bag as BagsRepositoryResponse<T>;

    const user = await this.inMemoryUsersRepository.findById(bag.user_id.value);

    if (!user) return null;

    return BagAggregate.create({
      ...bag.props,
      user,
    }) as BagsRepositoryResponse<T>;
  }

  async search<T extends RepositoryResponse = "entity">(
    { user_id, cycle_id, since }: BagsRepositorySearchRequest,
    type = "entity"
  ): Promise<BagsRepositoryResponse<T> | null> {
    const bag = this.items.find(
      (item) =>
        (!user_id || item.user_id.equals(user_id)) &&
        (!cycle_id || item.cycle_id.equals(cycle_id)) &&
        (!since || item.created_at >= since)
    );

    if (!bag) return null;

    if (type === "entity") return bag as BagsRepositoryResponse<T>;

    const user = await this.inMemoryUsersRepository.findById(bag.user_id.value);

    if (!user) return null;

    const aggreagate = BagAggregate.create({
      ...bag.props,
      user,
    });

    return aggreagate as BagsRepositoryResponse<T>;
  }

  async searchMany<T extends RepositoryResponse = "entity">(
    { page, cycle_id, name, status, since }: BagsRepositorySearchManyRequest,
    type = "entity"
  ): Promise<BagsRepositoryResponse<T>[]> {
    const bags = this.items.filter(
      (item) =>
        (!cycle_id || item.cycle_id.equals(cycle_id)) &&
        (!status || item.status === status) &&
        (!since || item.created_at >= since) &&
        (!name ||
          (() =>
            this.inMemoryUsersRepository.items.find(
              (user) =>
                (user.first_name.includes(name) ||
                  user.last_name.includes(name)) &&
                user.id.equals(item.user_id)
            ))())
    );

    if (type === "entity")
      return bags.slice(
        (page - 1) * 20,
        page * 20
      ) as BagsRepositoryResponse<T>[];

    const aggregates = [];

    for (const bag of bags) {
      const user = await this.inMemoryUsersRepository.findById(
        bag.user_id.value
      );

      if (!user) continue;

      const aggreate = BagAggregate.create({ ...bag.props, user });

      aggregates.push(aggreate);
    }

    return aggregates.slice(
      (page - 1) * 20,
      page * 20
    ) as BagsRepositoryResponse<T>[];
  }

  async create(bag: Bag): Promise<void> {
    this.items.push(bag);
  }
}
