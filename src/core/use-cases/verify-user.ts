// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";
import { SessionsRepository } from "@/core/repositories/sessions-repository";

// Services
import { Hasher } from "@/core/cryptography/hasher";

// Entities
import { Session } from "@/core/entities/session";

// Errors
import { WrongCredentialsError } from "@/core/errors/wrong-credentials";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { UserAlreadyVerified } from "@/core/errors/user-already-verified";

interface VerifyUserUsecaseRequest {
  token: string;
  ip: string;
  agent: string;
}

export class VerifyUserUsecase {
  constructor(
    private usersRepository: UsersRepository,
    private sessionsRepository: SessionsRepository,
    private hasher: Hasher
  ) {}

  async execute({ token, ip, agent }: VerifyUserUsecaseRequest) {
    const { user_id } = await this.hasher.decode(token);

    if (!user_id) {
      throw new WrongCredentialsError();
    }

    const user = await this.usersRepository.find("basic", { id: user_id });

    if (!user) throw new ResourceNotFoundError("Usuário", user_id);

    if (user.verified_at) throw new UserAlreadyVerified(user_id);

    user.verify();

    await this.usersRepository.update(user);

    const session = Session.create({
      user_id: user.id,
      agent,
      ip,
    });

    await this.sessionsRepository.create(session);

    token = await this.hasher.hash({ user_id: user.id.value });

    return {
      roles: user.roles,
      refresh: token,
    };
  }
}
