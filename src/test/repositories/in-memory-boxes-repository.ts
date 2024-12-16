// Entities
import { Box } from "@/core/entities/box";

// Repositories
import {
  BoxesRepository,
  BoxesRepositorySearchRequest,
} from "@/core/repositories/boxes-repository";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

// Utils
import { find } from "@/test/utils/find";
import { filter } from "@/test/utils/filter";
import { paginate } from "@/test/utils/paginate";

export class InMemoryBoxesRepository implements BoxesRepository {
  items: Box[] = [];

  async find(
    _: RepositoryResponse,
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

    if (orders?.page) box.orders = paginate(box.orders, orders.page);

    return box;
  }

  async list(
    _: RepositoryResponse,
    { catalog, orders, since, status }: BoxesRepositorySearchRequest,
    page?: number
  ): Promise<Box[]> {
    let boxes = await filter(
      this.items,
      async (item) =>
        Boolean(!catalog?.id || item.catalog_id.equals(catalog.id)) &&
        Boolean(
          !catalog?.farm?.id || item.catalog?.farm_id.equals(catalog.farm.id)
        ) &&
        Boolean(
          !catalog?.farm?.name ||
            item.catalog?.farm?.name.includes(catalog.farm.name!)
        ) &&
        (!since || item.created_at >= since) &&
        (!status || item.status === status)
    );

    if (orders?.page) {
      for (const box of boxes) box.orders = paginate(box.orders, orders.page);
    }

    if (page) boxes = paginate(boxes, page);

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
}
