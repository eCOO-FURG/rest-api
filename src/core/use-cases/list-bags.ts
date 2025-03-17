// Entities
import { BagStatus } from "@/core/entities/bag";

// Repositories
import { BagsRepository } from "@/core/repositories/bags-repository";
import { UsersRepository } from "@/core/repositories/users-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface ListBagsUseCaseRequest {
  page: number;
  user_id?: string;
  statuses?: BagStatus[];
  cycle_id?: string;
  name?: string;
  since?: Date;
  before?: Date;
}

export class ListBagsUseCase {
  constructor(
    private bagsRepository: BagsRepository,
    private usersRepository: UsersRepository,
    private cyclesRepository: CyclesRepository
  ) {}

  async execute({
    user_id,
    since,
    before,
    page,
    statuses,
    cycle_id,
  }: ListBagsUseCaseRequest) {
    if (user_id) {
      const user = await this.usersRepository.find("basic", { id: user_id });

      if (!user) throw new ResourceNotFoundError("Usuário", user_id);
    }

    if (cycle_id) {
      const cycle = await this.cyclesRepository.find("basic", {
        id: cycle_id,
      });

      if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);
    }

    const bags = await this.bagsRepository.list(
      "aggregate",
      {
        user: { id: user_id },
        cycle: { id: cycle_id },
        statuses,
        since,
        before,
      },
      page
    );

    return { bags };
  }
}
