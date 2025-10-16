// Entities
import { Market } from "@/core/entities/market";

// Repositories
import {
  MarketEntityOf,
  MarketsRepository,
  MarketsRepositoryReturnType,
  MarketsRepositorySearchRequest,
} from "@/core/repositories/markets-repository";

// Utils
import { paginate } from "@/test/utils/paginate";

export class InMemoryMarketsRepository implements MarketsRepository {
  items: MarketEntityOf<MarketsRepositoryReturnType>[] = [];

  async find<T extends MarketsRepositoryReturnType>(
    _: T,
    { id, name, open }: MarketsRepositorySearchRequest,
  ): Promise<MarketEntityOf<T> | null> {
    const market = this.items.find((item) =>
      Boolean(
        (!id || item.id.equals(id)) &&
          (!name || item.name.toLowerCase().includes(name.toLowerCase())) &&
          (typeof open !== "boolean" || item.open === open),
      ),
    );

    if (!market) {
      return null;
    }

    return market as MarketEntityOf<T>;
  }

  async list<T extends MarketsRepositoryReturnType>(
    _: T,
    filters: MarketsRepositorySearchRequest,
    page?: number,
  ): Promise<MarketEntityOf<T>[]> {
    let markets = this.items.filter((item) =>
      Boolean(
        (!filters.id || item.id.equals(filters.id)) &&
          (!filters.name || item.name.toLowerCase().includes(filters.name.toLowerCase())) &&
          (typeof filters.open !== "boolean" || item.open === filters.open),
      ),
    );

    if (page) {
      markets = paginate(markets, page);
    }

    return markets as MarketEntityOf<T>[];
  }

  async create(market: Market): Promise<void> {
    this.items.push(market);
  }

  async update(market: Market): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(market.id));
    this.items[index] = market;
  }
}
