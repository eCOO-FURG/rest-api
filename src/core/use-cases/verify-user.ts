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

interface VerifyUserUsecaseRequest {
  token: string;
  ip: string;
  agent: string;
}

export class VerifyUserUsecase {
  constructor(
    private usersRepository: UsersRepository,
    private sessionsRepository: SessionsRepository,
    private hasher: Hasher,
  ) {}

  async execute({ token, ip, agent }: VerifyUserUsecaseRequest) {
    const decoded = await this.hasher.decode(token);

    if (!decoded || !decoded.user_id) {
      throw new WrongCredentialsError();
    }

    const user = await this.usersRepository.find("user", {
      id: decoded.user_id,
    });

    if (!user) throw new ResourceNotFoundError("Usuário", decoded.user_id);

    const session = Session.create({
      user_id: user.id,
      user,
      agent,
      ip,
    });

    if (!user.verified_at) {
      user.verify();
    }

    await this.sessionsRepository.create(session);

    token = await this.hasher.hash({ user_id: user.id.value });

    return {
      roles: user.roles,
      refresh: token,
    };
  }
}
