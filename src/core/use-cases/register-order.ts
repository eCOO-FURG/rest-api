// Entities
import { Address } from "@/core/entities/address";
import { UUID } from "@/core/entities/aggregates/uuid";
import { Bag } from "@/core/entities/bag";
import { Box } from "@/core/entities/box";
import { Order } from "@/core/entities/order";
import { Message } from "@/core/entities/message";

// Repositories
import { AddressesRepository } from "@/core/repositories/addresses-repository";
import { BagsRepository } from "@/core/repositories/bags-repository";
import { BoxesRepository } from "@/core/repositories/boxes-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { OffersRepository } from "@/core/repositories/offers-repository";
import { MarketsRepository } from "@/core/repositories/markets-repository";
import { UsersRepository } from "@/core/repositories/users-repository";

// Errors
import { InvalidWeightError } from "@/core/errors/invalid-weight";
import { ResourceClosedError } from "@/core/errors/resource-closed";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { UnavailableAmountError } from "@/core/errors/unavailable-amount";

// Utils
import { first } from "@/core/utils/first";
import { inPeriodOf } from "@/core/utils/in-period-of";

// Mail
import { Mailer } from "@/core/mail/mailer";

interface RegisterOrderUseCaseRequest {
  user_id: string;
  items: {
    offer_id: string;
    amount: number;
  }[];
  market_id?: string;
  cycle_id?: string;
  residence?: {
    street: string;
    number: string;
    neighborhood: string;
    postal_code: string;
    complement?: string;
  };
}

export class RegisterOrderUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private cyclesRepository: CyclesRepository,
    private marketsRepository: MarketsRepository,
    private offersRepository: OffersRepository,
    private bagsRepository: BagsRepository,
    private boxesRepository: BoxesRepository,
    private addressesRepository: AddressesRepository,
    private mailer: Mailer,
  ) {}

  async execute({ user_id, cycle_id, market_id, residence, items }: RegisterOrderUseCaseRequest) {
    const user = await this.usersRepository.find("user", { id: user_id });

    if (!user) {
      throw new ResourceNotFoundError("Usuário", user_id);
    }

    const market = market_id
      ? await this.marketsRepository.find("market", { id: market_id })
      : null;

    if (market_id && !market) {
      throw new ResourceNotFoundError("Mercado", market_id);
    }

    if (market && !market.open) {
      throw new ResourceClosedError("Mercado", market.id.value);
    }

    const cycle = cycle_id ? await this.cyclesRepository.find("cycle", { id: cycle_id }) : null;

    if (cycle_id && !cycle) {
      throw new ResourceNotFoundError("Ciclo", cycle_id);
    }

    if (cycle && !inPeriodOf("order", cycle)) {
      throw new ResourceClosedError("Ciclo", cycle.id.value);
    }

    const address = residence
      ? ((await this.addressesRepository.find("address", residence)) ?? Address.create(residence))
      : null;

    const exsitent = await this.bagsRepository.find("bag", {
      user: { id: user.id.value },
      statuses: ["PENDING"],
      address: address ? { id: address.id.value } : null,
      ...(cycle && { since: first(cycle.order) }),
      ...(cycle_id && { cycle: { id: cycle_id } }),
      ...(market_id && { market: { id: market_id } }),
    });

    const bag = exsitent
      ? exsitent
      : Bag.create({
          customer_id: user.id,
          address,
          cycle_id: cycle_id ? new UUID(cycle_id) : null,
          market_id: market_id ? new UUID(market_id) : null,
        });

    const offers = await this.offersRepository.list("offer-and-details", {
      ids: items.map((order) => order.offer_id),
    });

    const boxes = new Map<UUID, Box>();

    for (const item of items) {
      const offer = offers.find((offer) => offer.id.value === item.offer_id);

      if (!offer) {
        throw new ResourceNotFoundError("Oferta", item.offer_id);
      }

      if (!offer.available) {
        throw new ResourceClosedError("Oferta", item.offer_id);
      }

      if (cycle_id && (!offer.cycle_id || !offer.cycle_id.equals(cycle_id))) {
        throw new ResourceNotFoundError(`Oferta ${item.offer_id} no ciclo`, cycle_id);
      }

      if (market_id && (!offer.market_id || !offer.market_id.equals(market_id))) {
        throw new ResourceNotFoundError(`Oferta ${item.offer_id} na feira`, market_id);
      }

      if (item.amount > offer.amount) {
        throw new UnavailableAmountError(offer.id.value);
      }

      if (offer.product.pricing === "WEIGHT" && item.amount % 100 != 0) {
        throw new InvalidWeightError("solicitado", offer.product.id.value);
      }

      const order = Order.create({
        amount: item.amount,
        bag_id: bag.id,
        offer_id: offer.id,
        offer,
        fee:
          offer.product.pricing === "WEIGHT"
            ? offer.fee * (item.amount / 1000)
            : offer.fee * item.amount,
        subtotal:
          offer.product.pricing === "WEIGHT"
            ? offer.price * (item.amount / 1000)
            : offer.price * item.amount,
      });

      bag.include(order);

      if (cycle) {
        const box = boxes.get(offer.farm_id);

        if (box) {
          order.pack(box);
          continue;
        }

        const existent = await this.boxesRepository.find("box", {
          farm: { id: offer.farm_id.value },
          cycle: { id: cycle.id.value },
          since: first(cycle.order),
        });

        if (existent) {
          boxes.set(offer.farm_id, existent);
          order.pack(existent);
          continue;
        }

        const created = Box.create({
          farm_id: offer.farm_id,
          cycle_id: cycle.id,
        });

        boxes.set(offer.farm_id, created);
        order.pack(created);
      }
    }

    await this.bagsRepository.save(bag);

    const view = await this.mailer.load({
      view: "order-notification",
      props: { first_name: user.first_name, bag, cycle, market },
    });

    const email = Message.create({
      to: user.email,
      subject: `Pedido ${bag.code} | eCOO`,
      content: view,
    });

    await this.mailer.send(email);

    return { bag };
  }
}
