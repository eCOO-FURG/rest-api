// Repositories
import { FarmsRepository } from "@/core/repositories/farms-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceReachedLimitError } from "@/core/errors/resource-reached-limit";

// Services
import { Storage } from "@/core/storage/storage";

// Types
import { File } from "@/core/types/file";

interface RegisterFarmImageUseCaseRequest {
  farm_id: string;
  image: File;
}

export class RegisterFarmImageUseCase {
  constructor(
    private farmsRepository: FarmsRepository,
    private storage: Storage
  ) {}

  async execute({ farm_id, image }: RegisterFarmImageUseCaseRequest) {
    const farm = await this.farmsRepository.find("basic", { id: farm_id });

    if (!farm) throw new ResourceNotFoundError("Fazenda", farm_id);

    if (farm.images.size >= 4)
      throw new ResourceReachedLimitError("Fazenda", farm_id, "images");

    const url = await this.storage.upload([image], "farms");

    farm.images.set(url[0], url[0]);

    await this.farmsRepository.update(farm);
  }
}
