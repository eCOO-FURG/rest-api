// Entities
import { Cycle, Week } from "@/core/entities/cycle";
import { Bag } from "@/core/entities/bag";
import { Order } from "@/core/entities/order";
import { Box } from "@/core/entities/box";
import { Address } from "@/core/entities/address";
import { User } from "@/core/entities/user";
import { UUID } from "@/core/entities/aggregates/uuid";

// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";
import { OffersRepository } from "@/core/repositories/offers-repository";
import { BagsRepository } from "@/core/repositories/bags-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { CatalogsRepository } from "@/core/repositories/catalogs-repository";
import { BoxesRepository } from "@/core/repositories/boxes-repository";
import { AddressesRepository } from "@/core/repositories/addresses-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { UnavailableAmountError } from "@/core/errors/unavailable-amount";
import { InvalidWeightError } from "@/core/errors/invalid-weight";
import { ResourceClosedError } from "@/core/errors/resource-closed";

// Utils
import { mostPast } from "@/core/utils/most-past";

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
  address?: Address;
  user: User;
  cycle: Cycle;
}

export class OrderProductsUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private cyclesRepository: CyclesRepository,
    private offersRepository: OffersRepository,
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
    const user = await this.usersRepository.find("basic", { id: user_id });

    if (!user) throw new ResourceNotFoundError("Usuário", user_id);

    const cycle = await this.cyclesRepository.find("basic", { id: cycle_id });

    if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    const today = (new Date().getDay() + 1) as Week[0];

    if (!cycle.order.includes(today))
      throw new ResourceClosedError("Ciclo", cycle_id);

    const offersIds = request.map((order) => order.offer_id);

    const offers = await this.offersRepository.list("aggregate", {
      ids: offersIds,
    });

    const destination = await this.useAddress(address);

    const { bag, existed } = await this.useBag({
      bag_id,
      cycle,
      user,
      address: destination,
    });

    for (const item of request) {
      const offer = offers.find((offer) => offer.id.equals(item.offer_id));

      if (!offer) throw new ResourceNotFoundError("Oferta", item.offer_id);

      const catalog = await this.catalogsRepository.find("basic", {
        id: offer.catalog?.id.value,
      });

      if (!catalog) throw new ResourceNotFoundError("Catálogo", item.offer_id);

      if (!catalog.cycle_id.equals(cycle_id))
        throw new ResourceNotFoundError("Catálogo", catalog.id.value);

      if (item.amount > offer.amount)
        throw new UnavailableAmountError(offer.id.value);

      const invalidAmount =
        item.amount % 100 != 0 && offer?.product?.pricing === "WEIGHT";

      if (invalidAmount)
        throw new InvalidWeightError("solicitado", offer.product.id.value);

      const box = await this.useBox(catalog.id);

      const order = Order.create({
        amount: item.amount,
        bag_id: bag.id,
        box_id: box.id,
        offer_id: offer.id,
        offer,
      });

      bag.add(order);
    }

    if (existed) {
      await this.bagsRepository.update(bag);
    } else {
      await this.bagsRepository.create(bag);
    }

    return { bag };
  }

  private async useAddress(address: OrderProductsUseCaseRequest["address"]) {
    if (!address) return;

    const found = await this.addressesRepository.find("basic", {
      street: address.street,
      number: address.number,
      complement: address.complement,
      neighborhood: address.neighborhood,
      postal_code: address.postal_code,
    });

    if (found) return found;

    const destination = Address.create(address);

    return destination;
  }

  private async useBag({ bag_id, user, address, cycle }: UseBagRequest) {
    if (bag_id) {
      const bag = await this.bagsRepository.find("merge", {
        id: bag_id,
        statuses: ["PENDING"],
        cycle: { id: cycle.id.value },
        since: mostPast(cycle.order),
      });

      if (!bag) throw new ResourceNotFoundError("Sacola", bag_id);

      if (bag.status !== "PENDING" || bag.created_at < mostPast(cycle.order))
        throw new ResourceClosedError("Sacola", bag_id);

      return { bag, existed: true };
    }

    const found = await this.bagsRepository.find("merge", {
      user: { id: user.id.value },
      cycle: { id: cycle.id.value },
      statuses: ["PENDING"],
      address: address ? { id: address.id.value } : null,
      since: mostPast(cycle.order),
    });

    if (found) return { bag: found, existed: true };

    const code = await this.otpGenerator.generate();

    const bag = Bag.create({
      user_id: user.id,
      cycle_id: cycle.id,
      address_id: address ? address.id : null,
      code,
      user,
      address,
    });

    return { bag, existed: false };
  }

  private async useBox(catalog_id: UUID) {
    const found = await this.boxesRepository.find("basic", {
      catalog: { id: catalog_id.value },
    });

    if (found) return found;

    const box = Box.create({ catalog_id });

    await this.boxesRepository.create(box);

    return box;
  }
}
