// Repositories
import { FarmsRepository } from "@/core/repositories/farms-repository";
import { UsersRepository } from "@/core/repositories/users-repository";

// Services
import { Storage } from "@/core/storage/storage";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { UnauthorizedError } from "@/core/errors/unauthorized";

interface DeleteFarmImageUseCaseRequest {
  user_id: string;
  farm_id: string;
  image_url: string;
}

export class DeleteFarmImageUseCase {
  constructor(
    private farmsRepository: FarmsRepository,
    private usersRepository: UsersRepository,
    private storage: Storage,
  ) {}

  async execute({
    user_id,
    farm_id,
    image_url,
  }: DeleteFarmImageUseCaseRequest) {
    const farm = await this.farmsRepository.find("farm", { id: farm_id });

    if (!farm) throw new ResourceNotFoundError("Fazenda", farm_id);

    const user = await this.usersRepository.find("user", { id: user_id });

    if (!user) throw new ResourceNotFoundError("Usuário", user_id);

    if (!farm.admin_id.equals(user.id)) throw new UnauthorizedError();

    const image = farm.images.find((image) => image === image_url);

    if (!image) throw new ResourceNotFoundError("Imagem", image_url);

    await this.storage.delete(image, "farms");

    farm.images = farm.images.filter((image) => image !== image_url);

    await this.farmsRepository.update(farm);
  }
}
