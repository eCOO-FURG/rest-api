// Errors
import { ResourceClosedError } from "@/core/errors/resource-closed";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceNotVerifiedError } from "@/core/errors/resource-not-verified";

// Repositories
import { BagsRepository } from "@/core/repositories/bags-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { UsersRepository } from "@/core/repositories/users-repository";

// Entities
import { Bag } from "@/core/entities/bag";
import { Message } from "@/core/entities/message";

// Message
import { Chat } from "@/core/message/chat";

interface UpdateBagUseCaseRequest {
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

  async execute({ bag_id, status }: UpdateBagUseCaseRequest) {
    const bag = await this.bagsRepository.find("bag-and-details", { id: bag_id });

    if (!bag) throw new ResourceNotFoundError("Sacola", bag_id);

    const user = await this.usersRepository.find("user", {
      id: bag.customer_id.value,
    });

    if (!user) throw new ResourceNotFoundError("Usuário", bag.customer_id.value);

    const cycle = await this.cyclesRepository.find("cycle", {
      id: bag.cycle_id.value,
    });

    if (!cycle) throw new ResourceNotFoundError("Ciclo", bag.cycle_id.value);

    if (bag.status === "CANCELLED") throw new ResourceClosedError("Sacola", bag_id);

    if (!bag.verified) throw new ResourceNotVerifiedError("Sacola", bag_id);

    bag.status = status ?? bag.status;
    bag.touch();

    await this.bagsRepository.update(bag);

    if (user.chat) {
      const message = Message.create({
        to: user.chat,
        subject: "Sacola atualizada",
        content: `A sacola ${bag.code} foi atualizada para ${STATUSES[bag.status]}.`,
      });

      await this.chat.send(message);
    }
  }
}

const STATUSES: Record<Bag["status"], string> = {
  SEPARATED: "separada",
  DISPATCHED: "despachada",
  RECEIVED: "recebida",
  CANCELLED: "cancelada",
  DEFERRED: "deferida",
  PENDING: "pendente",
};
