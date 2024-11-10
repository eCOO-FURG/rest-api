// Entities
import { Cycle, Week } from "@/core/entities/cycle";
import { Bag } from "@/core/entities/bag";
import { Order } from "@/core/entities/order";
import { Box } from "@/core/entities/box";
import { Address } from "@/core/entities/address";
import { User } from "@/core/entities/user";
import { UUID } from "@/core/entities/aggregates/uuid";
import { BagMerge } from "@/core/entities/merged/bag-merge";

// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";
import { OffersRepository } from "@/core/repositories/offers-repository";
import { OrdersRepository } from "@/core/repositories/orders-repository";
import { BagsRepository } from "@/core/repositories/bags-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { CatalogsRepository } from "@/core/repositories/catalogs-repository";
import { BoxesRepository } from "@/core/repositories/boxes-repository";
import { AddressesRepository } from "@/core/repositories/addresses-repository";
import { OrderMerge } from "@/core/entities/merged/order-merge";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { UnavailableAmountError } from "@/core/errors/unavailable-amount";
import { ClosedActionError } from "@/core/errors/closed-action";
import { InvalidWeightError } from "@/core/errors/invalid-weight";

// Utils
import { mostPast } from "@/core/utils/most-past";
import { currentDate } from "@/core/utils/current-date";

// Services
import { OtpProvider } from "@/core/cryptography/otp-provider";

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
  address: Address | null;
  user: User;
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
    private addressesRepository: AddressesRepository,
    private otpGenerator: OtpProvider
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
      "merged"
    );

    const destination = await this.useAddress(address);

    const bag = await this.useBag({
      bag_id,
      cycle,
      user,
      address: destination,
    });

    const orders: Order[] = [];

    for (const item of request) {
      const offer = offers.find((offer) => offer.id.equals(item.offer_id));

      if (!offer) throw new ResourceNotFoundError("Oferta", item.offer_id);

      const catalog = await this.catalogsRepository.search(
        { id: offer.catalog.id.value },
        "entity"
      );

      if (!catalog) throw new ResourceNotFoundError("Catálogo", item.offer_id);

      if (!catalog.cycle_id.equals(cycle_id))
        throw new ResourceNotFoundError("Catálogo", catalog.id.value);

      if (item.amount > offer.amount)
        throw new UnavailableAmountError(offer.id.value);

      const invalidAmount =
        item.amount % 100 != 0 && offer.product.pricing === "WEIGHT";

      if (invalidAmount)
        throw new InvalidWeightError("solicitado", offer.product.id.value);

      const box = await this.useBox(catalog.id);

      const order = Order.create({
        amount: item.amount,
        offer_id: offer.id,
        bag_id: bag.id,
        box_id: box.id,
      });

      orders.push(order);

      const merge = OrderMerge.create({ ...order.props, offer });

      bag.orders.push(merge);
    }

    await this.ordersRepository.createMany(orders);

    return { bag };
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

  private async useBag({ bag_id, user, address, cycle }: UseBagRequest) {
    if (bag_id) {
      const bag = await this.bagsRepository.search({ id: bag_id }, "merged");

      if (!bag) throw new ResourceNotFoundError("Sacola", bag_id);

      return bag;
    }

    const found = await this.bagsRepository.search(
      {
        user: { id: user.id.value },
        cycle: { id: cycle.id.value },
        address: address ? { id: address.id.value } : null,
        since: mostPast(cycle.order),
      },
      "merged"
    );

    if (found) return found;

    const date = currentDate();
    const code = await this.otpGenerator.generate();

    const bag = Bag.create({
      user_id: user.id,
      cycle_id: cycle.id,
      address_id: address ? address.id : null,
      code: `${date}-${code}`,
    });

    await this.bagsRepository.create(bag);

    return BagMerge.create({ ...bag.props, address, user });
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
}
