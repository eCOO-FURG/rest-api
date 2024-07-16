import { OfferWithProductAndCycle } from "@/core/entities/value-objects/offer-with-product-and-cycle";

export class OfferCompletePresenter {
  static toHttp(offer: OfferWithProductAndCycle) {
    return {
      id: offer.id.value,
      cycle_id: offer.cycle.id.value,
      farm_id: offer.farm_id.value,
      price: offer.price,
      amount: offer.amount,
      description: offer.description,
      created_at: offer.created_at,
      updated_at: offer.updated_at,
      product: {
        id: offer.product.id.value,
        name: offer.product.name,
        pricing: offer.product.pricing,
        image: offer.product.image,
        created_at: offer.product.created_at,
        updated_at: offer.product.updated_at,
      },
    }
  }
}