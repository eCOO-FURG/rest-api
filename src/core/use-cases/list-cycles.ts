// Repositories
import { CyclesRepository } from "@/core/repositories/cycles-repository";

export class ListCyclesUseCase {
  constructor(private cyclesRepository: CyclesRepository) {}

  async execute() {
    const cycles = await this.cyclesRepository.list("cycle", {});

    return { cycles };
  }
}
