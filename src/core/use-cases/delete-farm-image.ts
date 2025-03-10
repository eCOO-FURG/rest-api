// Repositories
import { FarmsRepository } from "@/core/repositories/farms-repository";

// Services
import { Storage } from "@/core/storage/storage";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface DeleteFarmImageUseCaseRequest {
  farm_id: string;
  image_url: string;
}

export class DeleteFarmImageUseCase {
  constructor(
    private farmsRepository: FarmsRepository,
    private storage: Storage
  ) {}

  async execute({ farm_id, image_url }: DeleteFarmImageUseCaseRequest) {
    const farm = await this.farmsRepository.find("basic", { id: farm_id });

    if (!farm) throw new ResourceNotFoundError("Fazenda", farm_id);

    const image = farm.images.get(image_url);

    if (!image) throw new ResourceNotFoundError("Imagem", image_url);

    await this.storage.delete(image, "farms");

    farm.images.delete(image_url);

    await this.farmsRepository.update(farm);
  }
}
