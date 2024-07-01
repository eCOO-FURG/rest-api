import { CyclesRepository } from "../repositories/cycles-repository";
import { FarmsRepository } from "../repositories/farms-repository";
import { OrdersRepository } from "../repositories/orders-repository";
import { OffersRepository } from "../repositories/offers-repository";

import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { MissingOfferDeliveryStatusError } from "@/core/errors/missing-offer-delivery-status";

import { Farm } from "../entities/farm";
import { Cycle } from "../entities/cycle";
import { Offer } from "../entities/offer";
import { Order } from "../entities/order";

interface CheckFarmDeliveryUseCaseRequest {
  cycle_id: Cycle["id"]["_value"];
  farm_id: Farm["id"]["value"];
  offers_fulfillment: Record<Offer["id"]["value"], Order["status"]>;
}

export class CheckFarmDeliveryUseCase {
  constructor(
    private cyclesRepository: CyclesRepository,
    private farmsRepository: FarmsRepository,
    private offersRepository: OffersRepository,
    private ordersRepository: OrdersRepository
  ) {}

  async execute({
    cycle_id,
    farm_id,
    offers_fulfillment,
  }: CheckFarmDeliveryUseCaseRequest) {
    const cycle = await this.cyclesRepository.findById(cycle_id);
    if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    const farm = await this.farmsRepository.findById(farm_id);
    if (!farm) throw new ResourceNotFoundError("Fazenda", farm_id);

    const cycleOffers = await this.offersRepository.findManyByCycleId(cycle_id);
    const cycleOffersMap = cycleOffers.reduce((map, offer) => {
      map.set(offer.id.value, offer);
      return map;
    }, new Map<string, Offer>());

    const cycleOrders =
      await this.ordersRepository.findManyWithOfferByOffersIds(
        Array.from(cycleOffersMap.keys())
      );

    let checkedOffers = new Set<string>([]);
    const updateStatusPromises = cycleOrders.map(async (order) => {
      const offerId = order.offer.id?.value;
      if (!offerId) return;

      if (!checkedOffers.has(offerId)) {
        if (!offers_fulfillment[offerId])
          throw new MissingOfferDeliveryStatusError(
            order.offer.product.name,
            order.id.value
          );
      }
      checkedOffers.add(offerId);

      const status = offers_fulfillment[offerId];

      if (status === "cancelled") {
        const offer = cycleOffersMap.get(offerId) as Offer;

        await this.offersRepository.update({
          ...offer,
          amount: (offer.amount -= order.amount),
        } as Offer);
      }

      await this.ordersRepository.update({ ...order, status } as Order);
    });

    await Promise.all(updateStatusPromises);

    // ver questão do amount
  }
}
