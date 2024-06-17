//Entities
import { Agribusiness } from "../entities/agribusiness";

//Errors
import { ResourceAlreadyExistsError } from "../errors/resource-already-exists";
import { ResourceNotFoundError } from "../errors/resource-not-found";

//Repositories
import { AgribusinessRepository } from "../repositories/agribusiness-repository";
import { UsersRepository } from "../repositories/users-repository";

interface RegisterAgribusinessUseCaseRequest {
  user_id: string;
  caf: string;
  name: string;
}

export class RegisterAgribusinessUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private agribusinessRepository: AgribusinessRepository
  ) {}

  async execute({ user_id, caf, name }: RegisterAgribusinessUseCaseRequest) {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new ResourceNotFoundError("Usuário", user_id);
    }

    const agribusinessWithSameCaf = await this.agribusinessRepository.findByCaf(
      caf
    );

    if (agribusinessWithSameCaf) {
      throw new ResourceAlreadyExistsError("CAF", caf);
    }

    const agribusinessWithSameAdmin =
      await this.agribusinessRepository.findByAdminId(user_id);

    if (agribusinessWithSameAdmin) {
      throw new ResourceAlreadyExistsError("Agronegócio de", user_id);
    }

    const agribusiness = Agribusiness.create({
      admin_id: user.id,
      caf,
      name,
    });

    await this.agribusinessRepository.save(agribusiness);
  }
}
