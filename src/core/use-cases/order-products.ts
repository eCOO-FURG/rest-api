// Entities
import { Cycle, Week } from "@/core/entities/cycle";
import { Bag } from "@/core/entities/bag";
import { Order } from "@/core/entities/order";
import { UUID } from "@/core/entities/aggregates/uuid";

// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";
import { OffersRepository } from "@/core/repositories/offers-repository";
import { OrdersRepository } from "@/core/repositories/orders-repository";
import { BagsRepository } from "@/core/repositories/bags-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";

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
  address?: string;
  request: {
    offer_id: string;
    amount: number;
  }[];
}

export class OrderProductsUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private cyclesRepository: CyclesRepository,
    private offersRepository: OffersRepository,
    private ordersRepository: OrdersRepository,
    private bagsRepository: BagsRepository
  ) {}

  async execute({
    user_id,
    cycle_id,
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

    const bag = await this.useBag(user.id, cycle, address);

    const orders: Order[] = [];

    for (const item of request) {
      const offer = offers.find((offer) => offer.id.equals(item.offer_id));

      if (!offer || !offer.cycle_id.equals(cycle_id))
        throw new ResourceNotFoundError("Oferta", item.offer_id);

      if (item.amount > offer.amount)
        throw new UnavailableAmountError(offer.id.value);

      if (
        offer.product.pricing === "WEIGHT" &&
        !this.orderedAmountIsLegal(item.amount)
      ) {
        throw new InvalidWeightError("solicitado", offer.product.id.value);
      }

      const order = Order.create({
        amount: item.amount,
        offer_id: offer.id,
        bag_id: bag.id,
      });

      orders.push(order);
    }

    await this.ordersRepository.createMany(orders);
  }

  private async useBag(user_id: UUID, cycle: Cycle, address?: string) {
    const exists = await this.bagsRepository.search(
      {
        user_id: user_id.value,
        cycle_id: cycle.id.value,
        since: mostPast(cycle.order),
      },
      "entity"
    );

    if (exists) return exists;

    const bag = Bag.create({ user_id, cycle_id: cycle.id, address });

    await this.bagsRepository.create(bag);

    return bag;
  }

  private orderedAmountIsLegal(amount: number) {
    return amount % 100 === 0;
  }
}
