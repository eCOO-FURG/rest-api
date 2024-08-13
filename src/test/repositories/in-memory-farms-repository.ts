// Entities
import { Farm } from "@/core/entities/farm";

// Repositories
import {
  FarmsRepository,
  FarmsRepositoryFindManyWithActiveOfferRequest,
  FarmsRepositorySearchManyWithOrdersRequest,
} from "@/core/repositories/farms-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository";

export class InMemoryFarmsRepository implements FarmsRepository {
  items: Farm[] = [];

  constructor(
    private inMemoryUsersRepository: InMemoryUsersRepository,
    private inMemoryOffersRepository: InMemoryOffersRepository,
    private inMemoryProductsRepository: InMemoryProductsRepository,
    private inMemoryOrdersRepository: InMemoryOrdersRepository
  ) {}
  async findById(id: string): Promise<Farm | null> {
    const farm = this.items.find((item) => item.id.equals(id));

    if (!farm) return null;

    return farm;
  }

  async findByCaf(caf: string): Promise<Farm | null> {
    const farm = this.items.find((item) => item.caf === caf);

    if (!farm) return null;

    return farm;
  }

  async findByAdminId(admin_id: string): Promise<Farm | null> {
    const farm = this.items.find((item) => item.admin_id.equals(admin_id));

    if (!farm) return null;

    return farm;
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

  async searchMany(page: number, name?: string): Promise<Farm[]> {
    if (!name) {
      return this.items.slice((page - 1) * 20, page * 20);
    }

    const filtered = this.items.filter((farm) => farm.name.includes(name));

    return filtered.slice((page - 1) * 20, page * 20);
  }
}
