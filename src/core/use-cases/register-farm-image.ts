// Repositories
import { FarmsRepository } from "@/core/repositories/farms-repository";
import { UsersRepository } from "@/core/repositories/users-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceReachedLimitError } from "@/core/errors/resource-reached-limit";
import { UnauthorizedError } from "@/core/errors/unauthorized";

// Services
import { Storage } from "@/core/storage/storage";

// Types
import { File } from "@/core/types/file";

interface RegisterFarmImageUseCaseRequest {
  user_id: string;
  farm_id: string;
  image: File;
}

export class RegisterFarmImageUseCase {
  constructor(
    private farmsRepository: FarmsRepository,
    private usersRepository: UsersRepository,
    private storage: Storage,
  ) {}

  async execute({ user_id, farm_id, image }: RegisterFarmImageUseCaseRequest) {
    const farm = await this.farmsRepository.find("farm", { id: farm_id });

    if (!farm) {
      throw new ResourceNotFoundError("Fazenda", farm_id);
    }

    const user = await this.usersRepository.find("user", { id: user_id });

    if (!user) {
      throw new ResourceNotFoundError("Usuário", user_id);
    }

    if (!farm.admin_id.equals(user.id)) {
      throw new UnauthorizedError();
    }

    if (farm.images.length >= 4) {
      throw new ResourceReachedLimitError("Fazenda", farm_id, "images");
    }

    const url = await this.storage.upload([image], "farms");

    farm.images.push(url[0]);

    await this.farmsRepository.update(farm);
  }
}
