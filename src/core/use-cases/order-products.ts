// Entities
import { Cycle, Week } from "@/core/entities/cycle";
import { Bag } from "@/core/entities/bag";
import { Order } from "@/core/entities/order";
import { Box } from "@/core/entities/box";
import { Address } from "@/core/entities/address";
import { UUID } from "@/core/entities/aggregates/uuid";

// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";
import { OffersRepository } from "@/core/repositories/offers-repository";
import { OrdersRepository } from "@/core/repositories/orders-repository";
import { BagsRepository } from "@/core/repositories/bags-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { CatalogsRepository } from "@/core/repositories/catalogs-repository";
import { BoxesRepository } from "@/core/repositories/boxes-repository";
import { AddressesRepository } from "@/core/repositories/addresses-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { UnavailableAmountError } from "@/core/errors/unavailable-amount";
import { ClosedActionError } from "@/core/errors/closed-action";
import { InvalidWeightError } from "@/core/errors/invalid-weight";

// Utils
import { mostPast } from "@/core/utils/most-past";

interface OrderProductsUseCaseRequest {
  user_id: string;
  cycle_id: string;
  request: {
    offer_id: string;
    amount: number;
  }[];
  bag_id?: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    postal_code: string;
  };
}

interface UseBagRequest {
  bag_id?: string;
  address_id: UUID | null;
  user_id: UUID;
  cycle: Cycle;
}

export class OrderProductsUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private cyclesRepository: CyclesRepository,
    private offersRepository: OffersRepository,
    private ordersRepository: OrdersRepository,
    private catalogsRepository: CatalogsRepository,
    private bagsRepository: BagsRepository,
    private boxesRepository: BoxesRepository,
    private addressesRepository: AddressesRepository
  ) {}

  async execute({
    user_id,
    cycle_id,
    bag_id,
    address,
    request,
  }: OrderProductsUseCaseRequest) {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new ResourceNotFoundError("Usuário", user_id);

    const cycle = await this.cyclesRepository.findById(cycle_id);

    if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    const today = (new Date().getDay() + 1) as Week[0];

    if (!cycle.order.includes(today)) {
      throw new ClosedActionError("comprar", cycle_id);
    }

    const offersIds = request.map((order) => order.offer_id);

    const offers = await this.offersRepository.searchMany(
      { ids: offersIds },
      "aggregate"
    );

    const destination = await this.useAddress(address);

    const bag = await this.useBag({
      bag_id,
      cycle,
      user_id: user.id,
      address_id: destination ? destination.id : null,
    });

    const orders: Order[] = [];

    for (const item of request) {
      const offer = offers.find((offer) => offer.id.equals(item.offer_id));

      if (!offer) throw new ResourceNotFoundError("Oferta", item.offer_id);

      const catalog = await this.catalogsRepository.search(
        { id: offer.catalog_id.value },
        "entity"
      );

      if (!catalog) throw new ResourceNotFoundError("Catálogo", item.offer_id);

      if (!catalog.cycle_id.equals(cycle_id))
        throw new ResourceNotFoundError("Catálogo", catalog.id.value);

      if (item.amount > offer.amount)
        throw new UnavailableAmountError(offer.id.value);

      if (
        offer.product.pricing === "WEIGHT" &&
        !this.orderedAmountIsLegal(item.amount)
      ) {
        throw new InvalidWeightError("solicitado", offer.product.id.value);
      }

      const box = await this.useBox(catalog.id);

      const order = Order.create({
        amount: item.amount,
        offer_id: offer.id,
        bag_id: bag.id,
        box_id: box.id,
      });

      orders.push(order);
    }

    await this.ordersRepository.createMany(orders);
  }

  private async useAddress(address: OrderProductsUseCaseRequest["address"]) {
    if (!address) return null;

    const found = await this.addressesRepository.search({
      street: address.street,
      number: address.number,
      complement: address.complement,
      neighborhood: address.neighborhood,
      postal_code: address.postal_code,
    });

    if (found) return found;

    const destination = Address.create(address);

    await this.addressesRepository.create(destination);

    return destination;
  }

  private async useBag({ bag_id, user_id, address_id, cycle }: UseBagRequest) {
    if (bag_id) {
      const bag = await this.bagsRepository.search({ id: bag_id }, "entity");

      if (!bag) throw new ResourceNotFoundError("Sacola", bag_id);

      return bag;
    }

    const found = await this.bagsRepository.search(
      {
        user: { id: user_id.value },
        cycle: { id: cycle.id.value },
        address: address_id ? { id: address_id.value } : null,
        since: mostPast(cycle.order),
      },
      "entity"
    );

    if (found) return found;

    const bag = Bag.create({
      user_id,
      cycle_id: cycle.id,
      address_id,
      code: "123456",
    });

    await this.bagsRepository.create(bag);

    return bag;
  }

  private async useBox(catalog_id: UUID) {
    const found = await this.boxesRepository.search(
      { catalog: { id: catalog_id.value } },
      "entity"
    );

    if (found) return found;

    const box = Box.create({ catalog_id });

    await this.boxesRepository.create(box);

    return box;
  }

  private orderedAmountIsLegal(amount: number) {
    return amount % 100 === 0;
  }
}
