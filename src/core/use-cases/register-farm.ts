// Entities
import { Farm } from "@/core/entities/farm";

// Errors
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Repositories
import { FarmsRepository } from "@/core/repositories/farms-repository";
import { UsersRepository } from "@/core/repositories/users-repository";

interface RegisterFarmUseCaseRequest {
  user_id: string;
  caf: string;
  name: string;
}

export class RegisterFarmUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private farmRepository: FarmsRepository
  ) {}

  async execute({ user_id, caf, name }: RegisterFarmUseCaseRequest) {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new ResourceNotFoundError("Usuário", user_id);
    }

    const farmWithSameCaf = await this.farmRepository.search({ caf }, "entity");

    if (farmWithSameCaf) {
      throw new ResourceAlreadyExistsError("CAF", caf);
    }

    const farmWithSameAdmin = await this.farmRepository.search(
      { admin: { id: user_id } },
      "entity"
    );

    if (farmWithSameAdmin) {
      throw new ResourceAlreadyExistsError("Agronegócio de", user_id);
    }

    const farm = Farm.create({
      admin_id: user.id,
      caf,
      name,
    });

    await this.farmRepository.create(farm);
  }
}
