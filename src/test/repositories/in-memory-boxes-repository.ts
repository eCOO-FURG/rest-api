// Entities
import { Box } from "@/core/entities/box";
import { BoxAndOrders } from "@/core/entities/aggregates/box-and-orders";

// Repositories
import {
  BoxesRepository,
  BoxesRepositorySearchRequest,
  BoxRepositoryReturnType,
  BoxEntityOf,
} from "@/core/repositories/boxes-repository";

// Utils
import { paginate } from "@/test/utils/paginate";

// Factories
import { makeUser } from "@/test/factories/make-user";
import { makeCatalog } from "@/test/factories/make-catalog";
import { makeFarm } from "@/test/factories/make-farm";
import { makeCatalogAndFarm } from "@/test/factories/make-farm-and-catalog";

export class InMemoryBoxesRepository implements BoxesRepository {
  items: Box[] = [];

  async find<T extends BoxRepositoryReturnType>(
    type: T,
    { id, catalog, orders, since, status }: BoxesRepositorySearchRequest
  ): Promise<BoxEntityOf<T> | null> {
    const box = this.items.find((item) =>
      Boolean(
        (!id || item.id.equals(id)) &&
          (!catalog?.id || item.catalog_id.equals(catalog.id)) &&
          (!catalog?.farm?.id ||
            item.catalog?.farm_id.equals(catalog.farm.id)) &&
          (!catalog?.farm?.name ||
            item.catalog?.farm?.name.includes(catalog.farm.name!)) &&
          (!since || item.created_at >= since) &&
          (!status || item.status === status)
      )
    );

    if (!box) return null;

    if (orders?.page) box.orders = paginate(box.orders, orders.page);

    switch (type) {
      default:
        return box as BoxEntityOf<T>;
      case "box-and-orders":
        return BoxAndOrders.create({
          ...box.props,
          catalog: makeCatalogAndFarm(box.catalog),
        }) as BoxEntityOf<T>;
      case "box-and-catalog":
        return BoxAndOrders.create({
          ...box.props,
          catalog: makeCatalogAndFarm(box.catalog),
        }) as BoxEntityOf<T>;
    }
  }
  async list<T extends BoxRepositoryReturnType>(
    type: T,
    { catalog, orders, since, status }: BoxesRepositorySearchRequest,
    page?: number
  ): Promise<BoxEntityOf<T>[]> {
    let boxes = this.items.filter((item) =>
      Boolean(
        (!catalog?.id || item.catalog_id.equals(catalog.id)) &&
          (!catalog?.farm?.id ||
            item.catalog?.farm_id.equals(catalog.farm.id)) &&
          (!catalog?.farm?.name ||
            item.catalog?.farm?.name.includes(catalog.farm.name!)) &&
          (!since || item.created_at >= since) &&
          (!status || item.status === status)
      )
    );

    if (orders?.page) {
      for (const box of boxes) box.orders = paginate(box.orders, orders.page);
    }

    if (page) boxes = paginate(boxes, page);

    switch (type) {
      default:
        return boxes as BoxEntityOf<T>[];
      case "box-and-orders":
        return boxes.map(
          (box) =>
            BoxAndOrders.create({
              ...box.props,
              catalog: makeCatalogAndFarm(box.catalog),
            }) as BoxEntityOf<T>
        );
      case "box-and-catalog":
        return boxes.map(
          (box) =>
            BoxAndOrders.create({
              ...box.props,
              catalog: makeCatalogAndFarm(box.catalog),
            }) as BoxEntityOf<T>
        );
    }
  }

  async count(filters: BoxesRepositorySearchRequest): Promise<number> {
    return (await this.list("box", filters)).length;
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
