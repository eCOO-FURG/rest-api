// Repositories
import { CyclesRepository } from "../repositories/cycles-repository";
import { FarmsRepository } from "../repositories/farms-repository";
import { OrdersRepository } from "../repositories/orders-repository";
import { OffersRepository } from "../repositories/offers-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { MissingOfferDeliveryStatusError } from "@/core/errors/missing-offer-delivery-status";

// Entities
import { Offer } from "../entities/offer";
import { Order } from "../entities/order";
import { OrderWithOffer } from "../entities/value-objects/order-with-offer";
import { UUID } from "../entities/value-objects/uuid";

// Utils
import { mostPast } from "../utils/most-past";

interface CheckFarmDeliveryUseCaseRequest {
  cycle_id: string;
  farm_id: string;
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

    const cycleOrders = await this.farmsRepository.searchOrders({
      farm_id,
      cycle_id,
      created_at: mostPast(cycle.offer),
    });

    const offersToUpdate = new Map();
    const ordersToUpdate = new Map();

    cycleOrders.forEach(async (order: OrderWithOffer) => {
      const offerId = order.offer.id?.value;
      if (!offerId) return;

      if (!offers_fulfillment[offerId])
        throw new MissingOfferDeliveryStatusError(
          order.offer.product.name,
          order.id.value
        );
      const status = offers_fulfillment[offerId];

      const {
        price,
        description,
        farm_id,
        product,
        cycle_id,
        id,
        amount,
        delivered_at,
      } = offersToUpdate.get(order.offer.id?.value) || order.offer;
      const newOffer = Offer.create({
        id,
        description,
        price,
        farm_id,
        product_id: product.id,
        cycle_id,
        delivered_at: delivered_at || new Date(),
        amount: status === "cancelled" ? amount + order.amount : amount,
      });
      offersToUpdate.set(id?.value, newOffer);

      const updatedOrder = Order.create({
        ...order,
        user_id: order.user_id,
        offer_id: order.offer.id as UUID,
        amount: order.amount,
        status,
      });
      ordersToUpdate.set(order.id.value, updatedOrder);
    });

    await this.offersRepository.updateMany(Array.from(offersToUpdate.values()));
    await this.ordersRepository.updateMany(Array.from(ordersToUpdate.values()));
  }
}
