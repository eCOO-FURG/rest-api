// Entities
import { Order } from "@/core/entities/order";
import { Week } from "@/core/entities/cycle";

// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";
import { OffersRepository } from "@/core/repositories/offers-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { OrdersRepository } from "@/core/repositories/orders-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { UnavailableAmountError } from "@/core/errors/unavailable-amount";
import { ClosedActionError } from "@/core/errors/closed-action";
import { InvalidWeightError } from "../errors/invalid-weight";
import { ResourceAlreadyExistsError } from "../errors/resource-already-exists";

interface OrderProductsUseCaseRequest {
  user_id: string;
  offer_id: string;
  amount: number;
}

export class OrderProducts {
  constructor(
    private usersRepository: UsersRepository,
    private offersRepository: OffersRepository,
    private cyclesRepository: CyclesRepository,
    private ordersRepository: OrdersRepository
  ) {}

  async execute({ user_id, offer_id, amount }: OrderProductsUseCaseRequest) {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new ResourceNotFoundError("Usuário", user_id);

    const offer = await this.offersRepository.findByIdWithProduct(offer_id);

    if (!offer) throw new ResourceNotFoundError("Oferta", offer_id);

    const cycle = await this.cyclesRepository.findById(offer.cycle_id.value);

    if (!cycle) throw new ResourceNotFoundError("Ciclo", offer.cycle_id.value);

    const today = (new Date().getDay() + 1) as Week[0];

    if (!cycle.offer.includes(today)) {
      throw new ClosedActionError("comprar", cycle.id.value);
    }

    const alreadyOrdered = await this.ordersRepository.findByOfferId(
      offer.id.value
    );

    if (alreadyOrdered)
      throw new ResourceAlreadyExistsError("Pedido de", offer_id);

    if (amount > offer.amount) throw new UnavailableAmountError(offer_id);

    if (offer.product.pricing === "WEIGHT" && amount % 100 !== 0) {
      throw new InvalidWeightError("solicitado", offer.product.id.value);
    }

    const order = Order.create({
      offer_id: offer.id,
      user_id: user.id,
      amount,
    });

    await this.ordersRepository.create(order);
  }
}
