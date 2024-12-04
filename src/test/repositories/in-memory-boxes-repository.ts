// Entities
import { Box } from "@/core/entities/box";

// Repositories
import {
  BoxesRepository,
  BoxesRepositorySearchRequest,
} from "@/core/repositories/boxes-repository";
import { InMemoryCatalogsRepository } from "@/test/repositories/in-memory-catalogs-repository";
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

// Utils
import { find } from "@/test/utils/find";
import { filter } from "@/test/utils/filter";

export class InMemoryBoxesRepository implements BoxesRepository {
  items: Box[] = [];

  constructor(
    private inMemoryCatalogsRepository: InMemoryCatalogsRepository,
    private inMemoryOrdersRepository: InMemoryOrdersRepository
  ) {}

  async find(
    type: RepositoryResponse,
    { id, catalog, orders, since, status }: BoxesRepositorySearchRequest
  ): Promise<Box | null> {
    const box = await find<Box>(
      this.items,
      async (item) =>
        (!id || item.id.equals(id)) &&
        (!catalog?.id || item.catalog_id.equals(catalog.id)) &&
        Boolean(
          !catalog?.farm?.id || item.catalog?.farm_id.equals(catalog.farm.id)
        ) &&
        Boolean(
          !catalog?.farm?.name ||
            item.catalog?.farm?.name.includes(catalog.farm.name!)
        ) &&
        Boolean(
          !catalog?.cycle?.id || item.catalog?.cycle_id.equals(catalog.cycle.id)
        ) &&
        (!since || item.created_at >= since) &&
        (!status || item.status === status)
    );

    if (!box) return null;

    if (type === "basic") return box;

    const _catalog = await this.inMemoryCatalogsRepository.find("aggregate", {
      id: box.catalog_id.value,
    });

    if (!_catalog) return null;

    if (type === "aggregate")
      return Box.create({ ...box.props, catalog: _catalog });

    const _orders = await this.inMemoryOrdersRepository.list(
      "basic",
      {
        box: { id: box.id.value },
      },
      orders?.page
    );

    return Box.create({ ...box.props, catalog: _catalog, orders: _orders });
  }

  async list(
    type: RepositoryResponse,
    { catalog, orders, since, status }: BoxesRepositorySearchRequest,
    page?: number
  ): Promise<Box[]> {
    let boxes = await filter(
      this.items,
      async (item) =>
        Boolean(!catalog?.id || item.catalog_id.equals(catalog.id)) &&
        (!since || item.created_at >= since) &&
        (!status || item.status === status)
    );

    if (page) boxes = this.slice(boxes, page);

    if (type === "basic") return boxes;

    for (const [index, box] of boxes.entries()) {
      const _catalog = await this.inMemoryCatalogsRepository.find("basic", {
        id: box.catalog_id.value,
      });

      if (!_catalog) continue;

      boxes[index] = Box.create({ ...box.props, catalog: _catalog });
    }

    if (type === "aggregate") return boxes;

    for (const [index, box] of boxes.entries()) {
      const _orders = await this.inMemoryOrdersRepository.list("basic", {
        box: { id: box.id.value },
      });

      boxes[index] = Box.create({
        ...box.props,
        orders: _orders,
      });
    }

    return boxes;
  }

  async count(filters: BoxesRepositorySearchRequest): Promise<number> {
    const boxes = await this.list("basic", filters);
    return boxes.length;
  }

  async create(box: Box): Promise<void> {
    this.items.push(box);
  }

  async update(box: Box): Promise<void> {
    const found = this.items.findIndex((item) => item.id.equals(box.id));

    if (!found) return;

    this.items[found] = box;
  }

  private slice(items: Box[], page: number): Box[] {
    const size = 20;
    const start = (page - 1) * size;
    const end = start + size;
    return items.slice(start, end);
  }
}
