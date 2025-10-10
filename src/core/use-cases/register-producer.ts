// Use-cases
import { RegisterUseCase } from "@/core/use-cases/register";
import { RegisterFarmUseCase } from "@/core/use-cases/register-farm";

// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Types
import { File } from "@/core/types/file";

interface RegisterProducerUseCaseRequest {
  first_name: string;
  last_name: string;
  email: string;
  cpf: string;
  phone: string;
  name: string;
  tally: string;
  chat?: string;
  photo?: File;
}

export class RegisterProducerUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private registerUseCase: RegisterUseCase,
    private registerFarmUseCase: RegisterFarmUseCase,
  ) {}

  async execute({
    first_name,
    last_name,
    email,
    cpf,
    phone,
    name,
    tally,
    chat,
    photo,
  }: RegisterProducerUseCaseRequest) {
    await this.registerUseCase.execute({
      first_name,
      last_name,
      email,
      cpf,
      phone,
      role: "PRODUCER",
      chat,
      photo,
    });

    const user = await this.usersRepository.find("user", { email });

    if (!user) throw new ResourceNotFoundError("Usuário", email);

    try {
      await this.registerFarmUseCase.execute({
        user_id: user.id.value,
        name,
        tally,
      });
    } catch (error) {
      await this.usersRepository.delete(user);
      throw error;
    }
  }
}
