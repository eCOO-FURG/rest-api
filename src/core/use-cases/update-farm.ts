// Entities
import { Farm } from "@/core/entities/farm";

// Repositories
import { FarmsRepository } from "@/core/repositories/farms-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceReachedLimitError } from "@/core/errors/resource-reached-limit";

// Services
import { Storage } from "@/core/storage/storage";

// Types
import { File } from "@/core/types/file";

interface UpdateFarmUseCaseRequest {
  farm_id: string;
  name?: string;
  tally?: string;
  description?: string;
  status?: Farm["status"];
  photo?: File;
  images?: {
    add?: File[];
    remove?: string[];
  };
}

export class UpdateFarmUseCase {
  constructor(
    private farmsRepository: FarmsRepository,
    private storage: Storage
  ) {}

  async execute({
    farm_id,
    name,
    tally,
    description,
    status,
    photo,
    images,
  }: UpdateFarmUseCaseRequest) {
    const farm = await this.farmsRepository.find("basic", { id: farm_id });

    if (!farm) throw new ResourceNotFoundError("Fazenda", farm_id);

    farm.tally = tally ?? farm.tally;
    farm.name = name ?? farm.name;
    farm.status = status ?? farm.status;

    if (description) farm.description = description;

    if (images?.remove) {
      for (const image of images.remove) {
        if (!farm.images.has(image))
          throw new ResourceNotFoundError("Imagem", image);
      }
    }

    if (images?.add) {
      for (const image of images.add) {
        farm.images.set(image.name, image.name);
      }

      if (farm.images.size > 4)
        throw new ResourceReachedLimitError(
          "Fazenda",
          farm.id.value,
          "imagens"
        );

      const urls = await this.storage.upload(images.add, "farms");

      for (const url of urls) farm.images.set(url, url);
    }

    if (photo) {
      const urls = await this.storage.upload([photo], "farms");
      farm.photo = urls[0];
    }

    farm.touch();

    await this.farmsRepository.update(farm);
  }
}
