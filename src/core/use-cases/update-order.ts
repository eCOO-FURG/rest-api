// Entities
import { Order } from "@/core/entities/order";

// Repositories
import { OrdersRepository } from "@/core/repositories/orders-repository";
import { UsersRepository } from "@/core/repositories/users-repository";

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
    private ordersRepository: OrdersRepository
  ) {}

  async execute({ user_id, order_id, status }: UpdateOrderUseCaseRequest) {
    const user = await this.usersRepository.find("basic", { id: user_id });

    if (!user) throw new ResourceNotFoundError("Usuário", user_id);

    const order = await this.ordersRepository.find("basic", {
      id: order_id,
    });

    if (!order) throw new ResourceNotFoundError("Pedido", order_id);

    const owner = order.bag?.user_id.equals(user_id);

    if (!owner && !user.admin)
      throw new ResourceNotFoundError("Pedido", order_id);

    if (order.status === "CANCELLED")
      throw new ResourceClosedError("Pedido", order_id);

    order.status = status;

    await this.ordersRepository.update(order);
  }
}
