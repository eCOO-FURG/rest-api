// Repositories
import { FarmsRepository } from "@/core/repositories/farms-repository";
import { UsersRepository } from "@/core/repositories/users-repository";

// Services
import { Storage } from "@/core/storage/storage";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface DeleteFarmImageUseCaseRequest {
  user_id: string;
  farm_id: string;
  image_url: string;
}

export class DeleteFarmImageUseCase {
  constructor(
    private farmsRepository: FarmsRepository,
    private usersRepository: UsersRepository,
    private storage: Storage
  ) {}

  async execute({
    user_id,
    farm_id,
    image_url,
  }: DeleteFarmImageUseCaseRequest) {
    const farm = await this.farmsRepository.find("basic", { id: farm_id });

    if (!farm) throw new ResourceNotFoundError("Fazenda", farm_id);

    const image = farm.images.get(image_url);

    if (!image) throw new ResourceNotFoundError("Imagem", image_url);

    const user = await this.usersRepository.find("basic", { id: user_id });

    if (!user) throw new ResourceNotFoundError("Usuário", user_id);

    if (!farm.admin_id.equals(user.id) && !user.admin)
      throw new ResourceNotFoundError("Fazenda", farm_id);

    await this.storage.delete(image, "farms");

    farm.images.delete(image_url);

    await this.farmsRepository.update(farm);
  }
}
