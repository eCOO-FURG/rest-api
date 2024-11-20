// Entities
import { Box } from "@/core/entities/box";

// Repositories
import {
  BoxesRepository,
  BoxesRepositoryResponse,
  BoxesRepositorySearchManyRequest,
  BoxesRepositorySearchRequest,
} from "@/core/repositories/boxes-repository";
import { InMemoryCatalogsRepository } from "@/test/repositories/in-memory-catalogs-repository";
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";
import { BoxAggregate } from "@/core/entities/aggregates/box-aggregate";

// Utils
import { find } from "@/core/utils/find";
import { filter } from "@/core/utils/filter";
import { BoxMerge } from "@/core/entities/merged/box-merge";

export class InMemoryBoxesRepository implements BoxesRepository {
  items: Box[] = [];

  constructor(
    private inMemoryCatalogsRepository: InMemoryCatalogsRepository,
    private inMemoryOrdersRepository: InMemoryOrdersRepository
  ) {}

  async search<T extends RepositoryResponse>(
    { catalog, id, status, since }: BoxesRepositorySearchRequest,
    type: T
  ): Promise<BoxesRepositoryResponse<T> | null> {
    const box = await find<Box>(
      this.items,
      async (item) =>
        (!id || item.id.equals(id)) &&
        (!status || item.status === status) &&
        (!since || item.created_at >= since) &&
        (!catalog ||
          !!(await this.inMemoryCatalogsRepository.search(
            {
              id: catalog?.id,
              cycle: { id: catalog?.cycle?.id },
              farm: { name: catalog?.farm?.name },
            },
            "entity"
          )))
    );

    if (!box) return null;

    if (type === "aggregate") return box as BoxesRepositoryResponse<T>;

    const _catalog = await this.inMemoryCatalogsRepository.search(
      { id: box.catalog_id.value },
      "aggregate"
    );

    if (!_catalog) return null;

    const agreggate = BoxAggregate.create({
      ...box.props,
      catalog: _catalog,
    });

    if (type === "aggregate") return agreggate as BoxesRepositoryResponse<T>;

    const orders = await this.inMemoryOrdersRepository.searchMany(
      { box: { id: box.id.value } },
      "aggregate"
    );

    const merge = BoxMerge.create({ ...agreggate.props, orders });

    return merge as BoxesRepositoryResponse<T>;
  }

  async searchMany<T extends RepositoryResponse>(
    { catalog, page }: BoxesRepositorySearchManyRequest,
    type: T
  ): Promise<BoxesRepositoryResponse<T>[]> {
    let boxes = await filter<Box>(
      this.items,
      async (item) =>
        (!catalog?.farm?.name ||
          !!(await this.inMemoryCatalogsRepository.search(
            { id: item.catalog_id.value, farm: { name: catalog.farm.name } },
            "entity"
          ))) &&
        (!catalog?.cycle?.id ||
          !!(await this.inMemoryCatalogsRepository.search(
            { id: item.catalog_id.value, cycle: { id: catalog.cycle.id } },
            "entity"
          )))
    );

    if (page) {
      const start = (page - 1) * 20;
      const end = start + 20;
      boxes = boxes.slice(start, end);
    }

    if (type === "entity") return boxes as BoxesRepositoryResponse<T>[];

    const aggregates: BoxAggregate[] = [];

    for (const box of boxes) {
      const _catalog = await this.inMemoryCatalogsRepository.search(
        { id: box.catalog_id.value },
        "aggregate"
      );

      if (!_catalog) return [];

      aggregates.push(
        BoxAggregate.create({
          ...box.props,
          catalog: _catalog,
        })
      );
    }

    return aggregates as BoxesRepositoryResponse<T>[];
  }

  async create(box: Box): Promise<void> {
    this.items.push(box);
  }

  async update(box: Box): Promise<void> {
    const found = this.items.findIndex((item) => item.id.equals(box.id));

    if (!found) return;

    this.items[found] = box;
  }

  async count({
    status,
    catalog,
    id,
    since,
  }: BoxesRepositorySearchRequest): Promise<number> {
    const boxes = await filter<Box>(this.items, async (item) => {
      return (
        (!id || item.id.equals(id)) &&
        (!status || item.status === status) &&
        (!catalog ||
          !!(await this.inMemoryCatalogsRepository.search(
            {
              id: catalog?.id,
              cycle: { id: catalog?.cycle?.id },
              farm: { name: catalog?.farm?.name },
            },
            "entity"
          ))) &&
        (!since || item.created_at >= since)
      );
    });

    return boxes.length;
  }
}
