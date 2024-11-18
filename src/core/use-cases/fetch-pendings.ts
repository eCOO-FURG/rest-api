// Repositories
import { FarmsRepository } from "@/core/repositories/farms-repository";
import { BoxesRepository } from "@/core/repositories/boxes-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Cache
import { CacheManager } from "@/core/cache/cache-manager";

// Utils
import { mostPast } from "@/core/utils/most-past";

interface FetchPendingsUseCaseRequest {
  cycle_id: string;
}

export class FetchPendingsUseCase {
  constructor(
    private cyclesRepository: CyclesRepository,
    private farmsRepository: FarmsRepository,
    private boxesRepository: BoxesRepository,
    private cacheManager: CacheManager
  ) {}

  async execute({ cycle_id }: FetchPendingsUseCaseRequest) {
    const cycle = await this.cyclesRepository.findById(cycle_id);

    if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    const farms = await this.countFarms();

    const boxes = await this.countBoxes(cycle_id, mostPast(cycle.order));

    return { farms, boxes };
  }

  private async countFarms() {
    let farms = await this.cacheManager.get<number>("farms:pending");

    if (farms == null) {
      farms = await this.farmsRepository.count({ status: "PENDING" });

      await this.cacheManager.set("farms:pending", farms);
    }

    return farms;
  }

  private async countBoxes(cycle_id: string, period: Date) {
    const date = period.toISOString();

    let boxes = await this.cacheManager.get<number>(
      `boxes:pending:${cycle_id}:${date}`
    );

    if (boxes == null) {
      boxes = await this.boxesRepository.count({ status: "PENDING" });

      await this.cacheManager.set(`boxes:pending:${cycle_id}:${date}`, boxes);
    }

    return boxes;
  }
}
