// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { Offer } from "@/core/entities/offer";

// Repositories
import {
  OfferEntityOf,
  OfferRepositoryReturnType,
  OffersRepository,
  OffersRepositorySearchRequest,
} from "@/core/repositories/offers-repository";

// Utils
import { now } from "@/core/utils/now";
import { paginate } from "@/test/utils/paginate";

export class InMemoryOffersRepository implements OffersRepository {
  items: OfferEntityOf<OfferRepositoryReturnType>[] = [];

  async find<T extends OfferRepositoryReturnType>(
    _: T,
    {
      id,
      product,
      cycle,
      farm,
      market,
      since,
      active,
      recurring,
      available,
      before,
    }: OffersRepositorySearchRequest,
  ): Promise<OfferEntityOf<T> | null> {
    const offer = this.items.find((item) => {
      return (
        (!id || item.id.equals(id)) &&
        (!product?.id || item.product_id.equals(product.id)) &&
        (!product?.name || item.product?.name === product.name) &&
        (!product?.category?.id || item.product?.category_id.value === product.category.id) &&
        (!cycle?.id || item.cycle_id?.value === cycle.id) &&
        (!farm?.id || item.farm_id?.value === farm.id) &&
        (!market?.id || item.market_id?.value === market.id) &&
        (!farm?.name || item.farm?.name === farm.name) &&
        (!market?.name || item.market?.name === market.name) &&
        (!active || item.active === active) &&
        (!since || item.created_at >= since) &&
        (!before || item.created_at <= before) &&
        (typeof recurring !== "boolean" || (recurring ? item.closes_at : !item.closes_at)) &&
        (available === "CYCLE"
          ? (!item.opens_at || item.opens_at <= now()) &&
            (item.closes_at === null || item.closes_at > now()) &&
            (item.expires_at === null || item.expires_at >= now()) &&
            item.active &&
            item.amount > 0
          : available === "MARKET"
            ? (!item.opens_at || item.opens_at <= now()) &&
              (item.expires_at === null || item.expires_at >= now()) &&
              item.active &&
              item.amount > 0
            : true)
      );
    });

    if (!offer) {
      return null;
    }

    return offer as OfferEntityOf<T>;
  }

  async list<T extends OfferRepositoryReturnType>(
    _: T,
    { id, ids, cycle, product, available, since, before }: OffersRepositorySearchRequest,
    page?: number,
  ): Promise<OfferEntityOf<T>[]> {
    let offers = this.items.filter((item) => {
      return (
        (!id || item.id.equals(id)) &&
        (!ids || ids.includes(item.id.value)) &&
        (!cycle?.id || item.cycle_id?.value === cycle.id) &&
        (!product?.id || item.product_id.equals(product.id)) &&
        (!product?.name || item.product?.name === product.name) &&
        (!product?.category?.id || item.product?.category_id.value === product.category.id) &&
        (available === "CYCLE"
          ? (!item.opens_at || item.opens_at <= now()) &&
            (item.closes_at === null || item.closes_at > now()) &&
            (item.expires_at === null || item.expires_at >= now()) &&
            item.active &&
            item.amount > 0
          : available === "MARKET"
            ? (!item.opens_at || item.opens_at <= now()) &&
              (item.expires_at === null || item.expires_at >= now()) &&
              item.active &&
              item.amount > 0
            : true) &&
        (!since || item.created_at >= since) &&
        (!before || item.created_at <= before)
      );
    });

    if (page) {
      offers = paginate(offers, page);
    }

    return offers as OfferEntityOf<T>[];
  }

  async update(offer: Offer): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(offer.id));

    if (index === -1) {
      return;
    }

    this.items[index] = offer;
  }

  async delete(offer: Offer): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(offer.id));

    if (index === -1) {
      return;
    }

    this.items.splice(index, 1);
  }

  async create(offer: Offer): Promise<void> {
    this.items.push(offer);
  }

  async publishCycleOnMarket(cycle_id: string, market_id: string): Promise<void> {
    const offers = this.items.filter((item) => {
      if (!item.cycle_id) {
        return false;
      }

      return item.cycle_id.value === cycle_id;
    });

    for (const offer of offers) {
      offer.market_id = new UUID(market_id);
    }
  }
}
