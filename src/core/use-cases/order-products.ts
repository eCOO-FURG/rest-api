// Entities
import { Order } from "@/core/entities/order";
import { Week } from "@/core/entities/cycle";

// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";
import { OffersRepository } from "@/core/repositories/offers-repository";
import { OrdersRepository } from "@/core/repositories/orders-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { UnavailableAmountError } from "@/core/errors/unavailable-amount";
import { ClosedActionError } from "@/core/errors/closed-action";
import { InvalidWeightError } from "@/core/errors/invalid-weight";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";

interface OrderProductsUseCaseRequest {
  user_id: string;
  request: {
    offer_id: string;
    amount: number;
  }[]
}

export class OrderProductsUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private offersRepository: OffersRepository,
    private ordersRepository: OrdersRepository
  ) {}

  async execute({ user_id, request }: OrderProductsUseCaseRequest) {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new ResourceNotFoundError("Usuário", user_id);

    const offersIds = request.map((order) => order.offer_id)

    const offers = await this.offersRepository.findManyByIdsWithProductAndCycle(
      offersIds
    );

    const today = (new Date().getDay() + 1) as Week[0];

    const orders: Order[] = []
    
    for (const [ index, item ] of request.entries()) {
      const offer = offers.find((offer) => offer.id.equals(item.offer_id));

      if(!offer) throw new ResourceNotFoundError("Oferta", item.offer_id);

      if (!offer.cycle.order.includes(today)) throw new ClosedActionError("comprar", offer.cycle.alias);

      if(item.amount > offer.amount) throw new UnavailableAmountError(offer.id.value);

      if(offer.product.pricing === 'WEIGHT' && !this.orderedAmountIsLegal(item.amount)) {
        throw new InvalidWeightError("solicitado", offer.product.id.value)
      }

      const order = Order.create({
        amount: item.amount,
        offer_id: offer.id,
        user_id: user.id,
      })

      orders.push(order);
      orders.slice(index, -1);
    }

    const previous = await this.ordersRepository.findManyByOfferIdAndUserId(offersIds, user_id);

    if(previous.length) throw new ResourceAlreadyExistsError("Pedido de", previous[0].offer_id.value)

    await this.ordersRepository.createMany(orders);
  }

  private orderedAmountIsLegal(amount: number) {
    return amount % 100 === 0;
  }
}
