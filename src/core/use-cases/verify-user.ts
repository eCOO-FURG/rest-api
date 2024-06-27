// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";

// Services
import { Hasher } from "@/core/cryptography/hasher";

// Errors
import { WrongCredentialsError } from "@/core/errors/wrong-credentials";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { UserAlreadyVerified } from "@/core/errors/user-already-verified";

interface VerifyUserUsecaseRequest {
  token: string;
}

export class VerifyUserUsecase {
  constructor(
    private usersRepository: UsersRepository,
    private hasher: Hasher
  ) {}

  async execute({ token }: VerifyUserUsecaseRequest) {
    const { user_id } = await this.hasher.decode(token);

    if (!user_id) {
      throw new WrongCredentialsError();
    }

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new ResourceNotFoundError("Usuário", user_id);
    }

    if (user.verified_at) {
      throw new UserAlreadyVerified(user_id);
    }

    user.verify();

    await this.usersRepository.update(user);
  }
}
