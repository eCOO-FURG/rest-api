// Entities
import { Category } from "@/core/entities/category";
import { CategoryAndOffers } from "@/core/entities/aggregates/category-and-offers";

// Factories
import { makeCategory } from "@/test/factories/make-category";
import { makeOfferAndDetails } from "@/test/factories/make-offer-and-details";

export function makeCategoryAndOffers(category: Category = makeCategory()) {
  return CategoryAndOffers.create({
    ...category.props,
    offers: [makeOfferAndDetails()],
  });
}
