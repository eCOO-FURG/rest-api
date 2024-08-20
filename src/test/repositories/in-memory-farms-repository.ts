// Entities
import { Farm } from "@/core/entities/farm";
import { FarmAggregate } from "@/core/entities/value-objects/farm-aggregate";

// Repositories
import {
  FarmsRepository,
  FarmsRepositoryFindManyWithActiveOfferRequest,
  FarmsRepositoryResponse,
  FarmsRepositorySearchManyWithOrdersRequest,
  FarmsRepositorySearchRequest,
} from "@/core/repositories/farms-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository";
import { RepositoryResponse } from "@/core/types/repository-response";
import { FarmAggregate } from "@/core/entities/aggregates/farm-aggregate";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

export class InMemoryFarmsRepository implements FarmsRepository {
  items: Farm[] = [];

  constructor(
    private inMemoryUsersRepository: InMemoryUsersRepository,
    private inMemoryOffersRepository: InMemoryOffersRepository,
    private inMemoryProductsRepository: InMemoryProductsRepository,
    private inMemoryOrdersRepository: InMemoryOrdersRepository
  ) {}

  async search<T extends RepositoryResponse>(
    { id, admin_id, caf }: FarmsRepositorySearchRequest,
    type: T
  ): Promise<FarmsRepositoryResponse<T> | null> {
    const farm = this.items.find(
      (item) =>
        (!id || item.id.equals(id)) &&
        (!admin_id || item.admin_id.equals(admin_id)) &&
        (!caf || item.caf === caf)
    );

    if (!farm) return null;

    if (type === "entity") return farm as FarmsRepositoryResponse<T>;

    const admin = await this.inMemoryUsersRepository.findById(
      farm.admin_id.value
    );

    if (!admin) return null;

    const aggregate = FarmAggregate.create({
      ...farm.props,
      admin,
    });

    return aggregate as FarmsRepositoryResponse<T>;
  }

  async findManyWithActiveOffer({
    cycle_id,
    page,
    product,
    created_at,
  }: FarmsRepositoryFindManyWithActiveOfferRequest): Promise<Farm[]> {
    const sorted = this.items.sort((a, b) =>
      ("" + a.name).localeCompare(b.name)
    );

    const found: Farm[] = [];

    const products = this.inMemoryProductsRepository.items.filter((item) =>
      product ? item.name.includes(product) : true
    );

    if (!products.length) return found;

    for (const farm of sorted) {
      const offer = this.inMemoryOffersRepository.items.find(
        (offer) =>
          offer.cycle_id.equals(cycle_id) &&
          products.some((item) => item.id.equals(offer.product_id)) &&
          offer.created_at >= created_at
      );

      if (!offer) continue;

      found.push(farm);
    }

    const start = (page - 1) * 20;
    const end = start + 20;

    return found.slice(start, end);
  }

  async create(farm: Farm): Promise<void> {
    this.items.push(farm);

    const user = await this.inMemoryUsersRepository.findById(
      farm.admin_id.value
    );

    if (!user) {
      return;
    }

    user.roles.push("PRODUCER");

    await this.inMemoryUsersRepository.update(user);
  }

  async update(farm: Farm): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(farm.id));

    this.items[itemIndex] = farm;
  }

  async searchManyWithOrders({
    cycle_id,
    page,
    name,
  }: FarmsRepositorySearchManyWithOrdersRequest): Promise<Farm[]> {
    const orders = Array.from(this.inMemoryOrdersRepository.items.values());

    const offers = this.inMemoryOffersRepository.items.filter((offer) =>
      offer.cycle_id.equals(cycle_id)
    );

    const offersIdWithOrder = orders.map((order) => order.offer_id);

    const offersWithOrders = offers.filter(
      (offer) =>
        offer.cycle_id.equals(cycle_id) && offersIdWithOrder.includes(offer.id)
    );

    const farmsIdWithOrders = offersWithOrders.map((offer) => offer.farm_id);

    const filteredFarms = this.items.filter((farm) =>
      farmsIdWithOrders.includes(farm.id)
    );

    if (!name) {
      return filteredFarms.slice((page - 1) * 20, page * 20);
    }

    return filteredFarms
      .filter((farm) => farm.name === name)
      .slice((page - 1) * 20, page * 20);
  }

  async searchMany<T extends RepositoryResponse = "entity">(
    { page, name }: { page: number; name?: string },
    type = "entity"
  ): Promise<FarmsRepositoryResponse<T>[]> {
    const farms = this.items.filter(
      (farm) => !name || farm.name.includes(name)
    );

    if (type === "entity") {
      return farms.slice(
        (page - 1) * 20,
        page * 20
      ) as FarmsRepositoryResponse<T>[];
    }

    const aggregates = [];

    for (const farm of farms) {
      const admin = await this.findUserById(farm.admin_id.value);

      if (!admin) continue;

      const aggregate = FarmAggregate.create({ ...farm.props, admin });

      aggregates.push(aggregate);
    }

    return aggregates.slice(
      (page - 1) * 20,
      page * 20
    ) as FarmsRepositoryResponse<T>[];
  }

  private async findUserById(id: string) {
    return this.inMemoryUsersRepository.findById(id);
  }
}
