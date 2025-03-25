// Entities
import { Order } from "@/core/entities/order";

// Repositories
import { OrdersRepository } from "@/core/repositories/orders-repository";
import { UsersRepository } from "@/core/repositories/users-repository";
import { BagsRepository } from "@/core/repositories/bags-repository";

// Errors
import { ResourceClosedError } from "@/core/errors/resource-closed";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface UpdateOrderUseCaseRequest {
  user_id: string;
  order_id: string;
  status: Order["status"];
}

export class UpdateOrderUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private bagsRepository: BagsRepository,
    private ordersRepository: OrdersRepository
  ) {}

  async execute({ user_id, order_id, status }: UpdateOrderUseCaseRequest) {
    const user = await this.usersRepository.find("user", { id: user_id });

    if (!user) throw new ResourceNotFoundError("Usuário", user_id);

    const order = await this.ordersRepository.find("order", {
      id: order_id,
    });

    if (!order) throw new ResourceNotFoundError("Pedido", order_id);

    const bag = await this.bagsRepository.find("bag", {
      id: order.bag_id.value,
    });

    if (!bag) throw new ResourceNotFoundError("Sacola", order.bag_id.value);

    const owner = bag.customer_id.equals(user_id);

    if (!owner && !user.admin)
      throw new ResourceNotFoundError("Pedido", order_id);

    if (order.status === "CANCELLED")
      throw new ResourceClosedError("Pedido", order_id);

    order.status = status;
    order.touch();

    await this.ordersRepository.update(order);
  }
}
