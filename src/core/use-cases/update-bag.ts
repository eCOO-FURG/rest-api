// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceClosedError } from "@/core/errors/resource-closed";

// Repositories
import { BagsRepository } from "@/core/repositories/bags-repository";
import { UsersRepository } from "@/core/repositories/users-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";

// Entities
import { Bag } from "@/core/entities/bag";
import { Payment } from "@/core/entities/payment";
import { Week } from "@/core/entities/cycle";

interface UpdateBagUseCaseRequest {
  bag_id: string;
  user_id: string;
  status?: Bag["status"];
  payments?: {
    id: string;
    status?: Payment["status"];
    method?: Payment["method"];
    flag?: Payment["flag"];
  }[];
}

export class UpdateBagUseCase {
  constructor(
    private bagsRepository: BagsRepository,
    private usersRepository: UsersRepository,
    private cyclesRepository: CyclesRepository
  ) {}

  async execute({
    bag_id,
    user_id,
    status,
    payments,
  }: UpdateBagUseCaseRequest) {
    const bag = await this.bagsRepository.find("merge", { id: bag_id });

    if (!bag) throw new ResourceNotFoundError("Sacola", bag_id);

    const owner = bag.user_id.equals(user_id);

    if (!owner) {
      const user = await this.usersRepository.find("basic", { id: user_id });

      if (!user) throw new ResourceNotFoundError("Usuário", user_id);

      if (!user.admin) throw new ResourceNotFoundError("Sacola", bag_id);
    }

    const cycle = await this.cyclesRepository.find("basic", {
      id: bag.cycle_id.value,
    });

    if (!cycle) throw new ResourceNotFoundError("Ciclo", bag.cycle_id.value);

    const today = (new Date().getDay() + 1) as Week[0];

    if (!cycle.order.includes(today))
      throw new ResourceClosedError("Ciclo", bag.cycle_id.value);

    if (bag.status === "CANCELLED")
      throw new ResourceClosedError("Sacola", bag_id);

    bag.status = status ?? bag.status;

    for (const item of payments ?? []) {
      const payment = bag.payments.get(item.id);

      if (!payment) throw new ResourceNotFoundError("Pagamento", item.id);

      payment.status = item.status ?? payment.status;
      payment.method = item.method ?? payment.method;
      payment.flag = item.flag ?? payment.flag;

      payment.touch();
    }

    bag.touch();

    await this.bagsRepository.update(bag);
  }
}
