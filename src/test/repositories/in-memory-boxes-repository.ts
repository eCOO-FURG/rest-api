// Entities
import { Box } from "@/core/entities/box";
import { BoxAndOrders } from "@/core/entities/aggregates/box-and-orders";
import { OrderAndOffer } from "@/core/entities/aggregates/order-and-offer";

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
import { makeOfferAndDetails } from "@/test/factories/make-offer-and-details";
import { makeFarmAndAdmin } from "@/test/factories/make-farm-and-admin";

export class InMemoryBoxesRepository implements BoxesRepository {
  items: BoxEntityOf<BoxRepositoryReturnType>[] = [];

  async find<T extends BoxRepositoryReturnType>(
    type: T,
    { id, orders, since, before, cycle, farm, status }: BoxesRepositorySearchRequest,
  ): Promise<BoxEntityOf<T> | null> {
    const box = this.items.find((item) =>
      Boolean(
        (!id || item.id.equals(id)) &&
          (!cycle?.id || item.cycle_id.equals(cycle.id)) &&
          (!farm?.id || item.farm_id.equals(farm.id)) &&
          (!farm?.name || item.farm?.name.includes(farm.name!)) &&
          (!since || item.created_at >= since) &&
          (!before || item.created_at <= before) &&
          (!status || item.status === status),
      ),
    );

    if (!box) return null;

    if (orders?.page) box.orders = paginate(box.orders, orders.page);

    return box as BoxEntityOf<T>;
  }
  async list<T extends BoxRepositoryReturnType>(
    type: T,
    { orders, since, status }: BoxesRepositorySearchRequest,
    page?: number,
  ): Promise<BoxEntityOf<T>[]> {
    let boxes = this.items.filter((item) =>
      Boolean((!since || item.created_at >= since) && (!status || item.status === status)),
    );

    if (orders?.page) {
      for (const box of boxes) box.orders = paginate(box.orders, orders.page);
    }

    if (page) boxes = paginate(boxes, page);

    return boxes as BoxEntityOf<T>[];
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
