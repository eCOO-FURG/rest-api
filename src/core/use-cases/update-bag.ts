// Errors
import { ResourceClosedError } from "@/core/errors/resource-closed";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceNotVerifiedError } from "@/core/errors/resource-not-verified";
import { UnauthorizedError } from "@/core/errors/unauthorized";

// Repositories
import { BagsRepository } from "@/core/repositories/bags-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { UsersRepository } from "@/core/repositories/users-repository";

// Entities
import { Bag } from "@/core/entities/bag";
import { Message } from "@/core/entities/message";

// Message
import { Chat } from "@/core/message/chat";

// Constants
import { BAG_STATUS } from "@/core/contants/bag-status";

interface UpdateBagUseCaseRequest {
  user_id: string;
  bag_id: string;
  status?: Bag["status"];
}

export class UpdateBagUseCase {
  constructor(
    private bagsRepository: BagsRepository,
    private usersRepository: UsersRepository,
    private cyclesRepository: CyclesRepository,
    private chat: Chat,
  ) {}

  async execute({ user_id, bag_id, status }: UpdateBagUseCaseRequest) {
    const bag = await this.bagsRepository.find("bag-and-details", { id: bag_id });

    if (!bag) throw new ResourceNotFoundError("Sacola", bag_id);

    const user = await this.usersRepository.find("user", {
      id: user_id,
    });

    if (!user) throw new ResourceNotFoundError("Usuário", user_id);

    const cycle = await this.cyclesRepository.find("cycle", {
      id: bag.cycle_id.value,
    });

    if (!cycle) throw new ResourceNotFoundError("Ciclo", bag.cycle_id.value);

    const owner = bag.customer_id.equals(user.id);

    if (!owner && !user.admin) throw new ResourceNotFoundError("Sacola", bag_id);

    if (owner && status !== "CANCELLED") throw new UnauthorizedError();

    if (bag.status === "CANCELLED") throw new ResourceClosedError("Sacola", bag_id);

    if (bag.status === "PENDING" && status !== "CANCELLED") throw new ResourceNotVerifiedError("Sacola", bag_id);

    bag.status = status ?? bag.status;
    bag.touch();

    await this.bagsRepository.update(bag);

    if (user.chat) {
      const message = Message.create({
        to: user.chat,
        subject: "Sacola atualizada",
        content: `A sacola ${bag.code} foi atualizada para ${BAG_STATUS[bag.status]}.`,
      });

      await this.chat.send(message);
    }
  }
}
