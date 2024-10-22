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
  counterfoil_number: string;
  name: string;
}

export class RegisterFarmUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private farmRepository: FarmsRepository
  ) {}

  async execute({ user_id, counterfoil_number, name }: RegisterFarmUseCaseRequest) {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new ResourceNotFoundError("Usuário", user_id);
    }

    const farmWithSameCaf = await this.farmRepository.search({ counterfoil_number }, "entity");

    if (farmWithSameCaf) {
      throw new ResourceAlreadyExistsError("Número do Talão", counterfoil_number);
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
      counterfoil_number,
      name,
    });

    await this.farmRepository.create(farm);
  }
}
