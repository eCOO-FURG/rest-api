// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Services
import { Encrypter } from "@/core/cryptography/encrypter";

interface UpdateUserUseCaseRequest {
  user_id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  cpf?: string;
  phone?: string;
  password?: string;
}

export class UpdateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private encrypter: Encrypter
  ) { }

  async execute(props: UpdateUserUseCaseRequest) {
    const user = await this.usersRepository.findById(props.user_id);

    if (!user) {
      throw new ResourceNotFoundError("Usuário", props.user_id);
    }

    for (const field in props) {
      const value = props[field as keyof UpdateUserUseCaseRequest];

      if (!value) continue;

      const key = Object.keys(user.props).find((key) => key === field);

      if (key === 'password') {
        const hashed = await this.encrypter.encrypt(value as string)
        user.protect(hashed)
        continue
      }

      // @ts-ignore
      user[key] = value;
      user.touch();
    }

    await this.usersRepository.update(user);
  }
}
