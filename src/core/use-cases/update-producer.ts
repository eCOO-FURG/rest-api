// Use-cases
import { UpdateFarmUseCase } from "@/core/use-cases/update-farm";
import { UpdateUserUseCase } from "@/core/use-cases/update-user";

// Repositories
import { FarmsRepository } from "@/core/repositories/farms-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Types
import { File } from "@/core/types/file";

interface UpdateProducerUseCaseRequest {
  farm_id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  cpf?: string;
  phone?: string;
  name?: string;
  tally?: string;
  chat?: string;
  photo?: File;
}

export class UpdateProducerUseCase {
  constructor(
    private farmsRepository: FarmsRepository,
    private updateUserUseCase: UpdateUserUseCase,
    private updateFarmUseCase: UpdateFarmUseCase,
  ) {}

  async execute({
    farm_id,
    first_name,
    last_name,
    email,
    cpf,
    phone,
    name,
    tally,
    chat,
    photo,
  }: UpdateProducerUseCaseRequest) {
    const farm = await this.farmsRepository.find("farm", { id: farm_id });

    if (!farm) throw new ResourceNotFoundError("Fazenda", farm_id);

    await this.updateUserUseCase.execute({
      user_id: farm.admin_id.value,
      first_name,
      last_name,
      email,
      cpf,
      phone,
      chat,
      photo,
    });

    await this.updateFarmUseCase.execute({
      user_id: farm.admin_id.value,
      farm_id,
      name,
      tally,
    });
  }
}
