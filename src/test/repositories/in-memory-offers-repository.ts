// Entities
import { OfferAndDetails } from "@/core/entities/aggregates/offer-and-details";
import { OfferAndProduct } from "@/core/entities/aggregates/offer-and-product";
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

// Factories
import { makeCatalogAndFarm } from "@/test/factories/make-farm-and-catalog";
import { makeProduct } from "@/test/factories/make-product";
export class InMemoryOffersRepository implements OffersRepository {
  items: Offer[] = [];

  async find<T extends OfferRepositoryReturnType>(
    type: T,
    { id, catalog, product, since, active, recurring, available, before }: OffersRepositorySearchRequest,
  ): Promise<OfferEntityOf<T> | null> {
    const offer = this.items.find((item) => {
      return (
        (!id || item.id.equals(id)) &&
        (!catalog?.id || item.catalog_id.equals(catalog.id)) &&
        (!catalog?.cycle?.id || item.catalog?.cycle_id.value === catalog.cycle.id) &&
        (!product?.id || item.product_id.equals(product.id)) &&
        (!product?.name || item.product?.name === product.name) &&
        (!product?.category?.id || item.product?.category_id.value === product.category.id) &&
        (!active || item.active === active) &&
        (!since || item.created_at >= since) &&
        (!before || item.created_at <= before) &&
        (typeof recurring !== "boolean" || (recurring ? item.closes_at : !item.closes_at)) &&
        (typeof available !== "boolean" ||
          (available
            ? (item.closes_at === null || item.closes_at > now()) &&
              (item.expires_at === null || item.expires_at >= now()) &&
              item.active &&
              item.amount > 0
            : (item.closes_at !== null && item.closes_at <= now()) ||
              (item.expires_at !== null && item.expires_at <= now()) ||
              !item.active ||
              item.amount === 0))
      );
    });

    if (!offer) return null;

    switch (type) {
      default:
        return offer as OfferEntityOf<T>;
      case "offer-and-product":
        return OfferAndProduct.create({
          ...offer.props,
          product: offer.product ?? makeProduct(),
        }) as OfferEntityOf<T>;
      case "offer-and-details":
        return OfferAndDetails.create({
          ...offer.props,
          product: offer.product ?? makeProduct(),
          catalog: makeCatalogAndFarm(offer.catalog),
        }) as OfferEntityOf<T>;
    }
  }

  async list<T extends OfferRepositoryReturnType>(
    type: T,
    { id, ids, catalog, product, available, since, before }: OffersRepositorySearchRequest,
    page?: number,
  ): Promise<OfferEntityOf<T>[]> {
    let offers = this.items.filter((item) => {
      return (
        (!id || item.id.equals(id)) &&
        (!ids || ids.includes(item.id.value)) &&
        (!catalog?.id || item.catalog_id.equals(catalog.id)) &&
        (!catalog?.cycle?.id || item.catalog?.cycle_id.value === catalog.cycle.id) &&
        (!product?.id || item.product_id.equals(product.id)) &&
        (!product?.name || item.product?.name === product.name) &&
        (!product?.category?.id || item.product?.category_id.value === product.category.id) &&
        (!available ||
          (typeof available === "boolean" &&
            (available
              ? (item.closes_at === null || item.closes_at > now()) &&
                (item.expires_at === null || item.expires_at >= now()) &&
                item.active &&
                item.amount > 0
              : (item.closes_at !== null && item.closes_at <= now()) ||
                (item.expires_at !== null && item.expires_at <= now()) ||
                !item.active ||
                item.amount === 0))) &&
        (!since || item.created_at >= since) &&
        (!before || item.created_at <= before)
      );
    });

    if (page) offers = paginate(offers, page);

    switch (type) {
      default:
        return offers as OfferEntityOf<T>[];
      case "offer-and-details":
        return offers.map((offer) => {
          return OfferAndDetails.create({
            ...offer.props,
            product: offer.product ?? makeProduct(),
            catalog: makeCatalogAndFarm(offer.catalog),
          }) as OfferEntityOf<T>;
        });
    }
  }

  async update(offer: Offer): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(offer.id));

    if (index === -1) return;

    this.items[index] = offer;
  }

  async delete(offer: Offer): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(offer.id));

    if (index === -1) return;

    this.items.splice(index, 1);
  }
}
