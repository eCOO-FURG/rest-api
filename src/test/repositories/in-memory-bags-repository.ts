import { Bag } from "@/core/entities/bag";
import {
  BagsRepository,
  BagsRepositorySearchRequest,
} from "@/core/repositories/bags-repository";

export class InMemoryBagsRepository implements BagsRepository {
  items: Bag[] = [];

  async create(bag: Bag): Promise<void> {
    this.items.push(bag);
  }

  async search({
    user_id,
    cycle_id,
    since,
  }: BagsRepositorySearchRequest): Promise<Bag | null> {
    const bag = this.items.find(
      (item) =>
        (!user_id || item.user_id.equals(user_id)) &&
        (!cycle_id || item.cycle_id.equals(cycle_id)) &&
        (!since || item.created_at >= since)
    );

    if (!bag) return null;

    return bag;
  }
}
