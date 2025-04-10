// Entities
import { Address } from "@/core/entities/address";
import { UUID } from "@/core/entities/aggregates/uuid";
import { Bag } from "@/core/entities/bag";
import { Box } from "@/core/entities/box";
import { Cycle } from "@/core/entities/cycle";
import { Order } from "@/core/entities/order";
import { User } from "@/core/entities/user";
import { Message } from "@/core/entities/message";

// Repositories
import { AddressesRepository } from "@/core/repositories/addresses-repository";
import { BagsRepository } from "@/core/repositories/bags-repository";
import { BoxesRepository } from "@/core/repositories/boxes-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { OffersRepository } from "@/core/repositories/offers-repository";
import { UsersRepository } from "@/core/repositories/users-repository";

// Errors
import { InvalidWeightError } from "@/core/errors/invalid-weight";
import { ResourceClosedError } from "@/core/errors/resource-closed";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { UnavailableAmountError } from "@/core/errors/unavailable-amount";

// Utils
import { first } from "@/core/utils/first";

// Cryptography
import { OtpProvider } from "@/core/cryptography/otp-provider";

// Mail
import { Mailer } from "@/core/mail/mailer";

// Utils
import { today } from "@/core/utils/today";
interface RegisterOrderUseCaseRequest {
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
    neighborhood: string;
    postal_code: string;
    complement?: string;
  };
}

interface UseBagRequest {
  bag_id?: string;
  address?: Address;
  user: User;
  cycle: Cycle;
}

export class RegisterOrderUseCase {
  private boxes: Map<string, Box> = new Map();

  constructor(
    private usersRepository: UsersRepository,
    private cyclesRepository: CyclesRepository,
    private offersRepository: OffersRepository,
    private bagsRepository: BagsRepository,
    private boxesRepository: BoxesRepository,
    private addressesRepository: AddressesRepository,
    private otpGenerator: OtpProvider,
    private mailer: Mailer
  ) {}

  async execute({
    user_id,
    cycle_id,
    bag_id,
    address,
    request,
  }: RegisterOrderUseCaseRequest) {
    const user = await this.usersRepository.find("user", { id: user_id });

    if (!user) throw new ResourceNotFoundError("Usuário", user_id);

    const cycle = await this.cyclesRepository.find("cycle", { id: cycle_id });

    if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    if (!cycle.order.includes(today()))
      throw new ResourceClosedError("Ciclo", cycle_id);

    const offersIds = request.map((order) => order.offer_id);

    const offers = await this.offersRepository.list("offer-and-details", {
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

      if (offer.expired) throw new ResourceClosedError("Oferta", item.offer_id);

      if (!offer.catalog.cycle_id.equals(cycle_id))
        throw new ResourceClosedError("Oferta", item.offer_id);

      if (item.amount > offer.amount)
        throw new UnavailableAmountError(offer.id.value);

      const invalidAmount =
        item.amount % 100 != 0 && offer.product.pricing === "WEIGHT";

      if (invalidAmount)
        throw new InvalidWeightError("solicitado", offer.product.id.value);

      const box = await this.useBox(offer.catalog.id);

      const price =
        offer.product.pricing === "WEIGHT"
          ? offer.price * (item.amount / 1000)
          : offer.price * item.amount;

      const order = Order.create({
        box_id: box.id,
        bag_id: bag.id,
        box,
        offer_id: offer.id,
        offer,
        amount: item.amount,
        fee: price * (offer.catalog.fee / 100),
        price,
      });

      bag.add(order);
    }

    if (existed) {
      await this.bagsRepository.update(bag);
    } else {
      await this.bagsRepository.create(bag);
    }

    const view = await this.mailer.load({
      view: "order-notification",
      props: { first_name: user.first_name, bag, cycle, existed},
    });

    const email = Message.create({
      to: user.email,
      subject: "Pedido Confirmado!",
      content: view,
    });

    this.mailer.send([email]);

    return { bag };
  }

  private async useAddress(address: RegisterOrderUseCaseRequest["address"]) {
    if (!address) return;

    const found = await this.addressesRepository.find("address", {
      street: address.street,
      number: address.number,
      complement: address.complement,
      neighborhood: address.neighborhood,
      postal_code: address.postal_code,
    });

    if (found) return found;

    return Address.create(address);
  }

  private async useBag({ bag_id, user, address, cycle }: UseBagRequest) {
    if (bag_id) {
      const bag = await this.bagsRepository.find("bag-and-details", {
        id: bag_id,
        statuses: ["PENDING"],
        cycle: { id: cycle.id.value },
        since: first(cycle.order),
      });

      if (!bag) throw new ResourceNotFoundError("Sacola", bag_id);

      if (bag.status !== "PENDING" || bag.created_at < first(cycle.order))
        throw new ResourceClosedError("Sacola", bag_id);

      return { bag, existed: true };
    }

    const found = await this.bagsRepository.find("bag", {
      user: { id: user.id.value },
      cycle: { id: cycle.id.value },
      statuses: ["PENDING"],
      address: address ? { id: address.id.value } : null,
      since: first(cycle.order),
    });

    if (found) return { bag: found, existed: true };

    const code = await this.otpGenerator.generate();

    const bag = Bag.create({
      customer_id: user.id,
      cycle_id: cycle.id,
      address_id: address?.id,
      address,
      code,
    });

    return { bag, existed: false };
  }

  private async useBox(catalog_id: UUID) {
    const memorized = this.boxes.get(catalog_id.value);

    if (memorized) return memorized;

    const found = await this.boxesRepository.find("box-and-catalog", {
      catalog: { id: catalog_id.value },
    });

    if (found) {
      this.boxes.set(catalog_id.value, found);
      return found;
    }

    const box = Box.create({ catalog_id });

    this.boxes.set(catalog_id.value, box);

    return box;
  }
}
