// Entities
import { Farm } from "@/core/entities/farm";

// Repositories
import { FarmsRepository } from "@/core/repositories/farms-repository";
import { UsersRepository } from "@/core/repositories/users-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { UnauthorizedError } from "@/core/errors/unauthorized";

// Services
import { Storage } from "@/core/storage/storage";

// Types
import { File } from "@/core/types/file";

interface UpdateFarmUseCaseRequest {
  user_id: string;
  farm_id: string;
  name?: string;
  tally?: string;
  fee?: number;
  description?: string;
  status?: Farm["status"];
  photo?: File;
}

export class UpdateFarmUseCase {
  constructor(
    private farmsRepository: FarmsRepository,
    private usersRepository: UsersRepository,
    private storage: Storage,
  ) {}

  async execute({ user_id, farm_id, name, tally, fee, description, status, photo }: UpdateFarmUseCaseRequest) {
    const farm = await this.farmsRepository.find("farm", { id: farm_id });

    if (!farm) throw new ResourceNotFoundError("Fazenda", farm_id);

    const user = await this.usersRepository.find("user", { id: user_id });

    if (!user) throw new ResourceNotFoundError("Usuário", user_id);

    if (!farm.admin_id.equals(user.id) && !user.admin) throw new ResourceNotFoundError("Fazenda", farm_id);

    if (!user.admin && (status || fee)) throw new UnauthorizedError();

    farm.tally = tally ?? farm.tally;
    farm.name = name ?? farm.name;
    farm.status = status ?? farm.status;

    if (description) farm.description = description;

    if (photo) {
      const urls = await this.storage.upload([photo], "farms");
      farm.photo = urls[0];
    }

    farm.touch();

    await this.farmsRepository.update(farm);
  }
}
