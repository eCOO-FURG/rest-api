import { Bag } from "@/core/entities/bag";
import { BagAggregate } from "@/core/entities/value-objects/bag-aggregate";
import {
  BagsRepositoryResponse,
  BagsRepository,
  BagsRepositorySearchRequest,
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

  async create(bag: Bag): Promise<void> {
    this.items.push(bag);
  }

  async update(bag: Bag): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(bag.id));

    this.items[index] = bag;
  }
}
