// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceClosedError } from "@/core/errors/resource-closed";

// Repositories
import { BagsRepository } from "@/core/repositories/bags-repository";
import { UsersRepository } from "@/core/repositories/users-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";

// Entities
import { Bag } from "@/core/entities/bag";
import { Week } from "@/core/entities/cycle";

interface UpdateBagUseCaseRequest {
  bag_id: string;
  user_id: string;
  status?: Bag["status"];
}

export class UpdateBagUseCase {
  constructor(
    private bagsRepository: BagsRepository,
    private usersRepository: UsersRepository,
    private cyclesRepository: CyclesRepository
  ) {}

  async execute({ bag_id, user_id, status }: UpdateBagUseCaseRequest) {
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

    await this.bagsRepository.update(bag);
  }
}
