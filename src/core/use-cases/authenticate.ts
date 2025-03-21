// Entities
import { Session } from "@/core/entities/session";

// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";
import { SessionsRepository } from "@/core/repositories/sessions-repository";
import { OtpsRepository } from "@/core/repositories/otps-repositoy";

// Services
import { Encrypter } from "@/core/cryptography/encrypter";
import { Hasher } from "@/core/cryptography/hasher";

// Errors
import { WrongCredentialsError } from "@/core/errors/wrong-credentials";
import { MissingFieldError } from "@/core/errors/missing-field";
import { UserNotVerifiedError } from "@/core/errors/user-not-verified";

interface AuthenticateUseCaseRequest {
  email: string;
  password: string;
  ip: string;
  agent: string;
  type: "OTP" | "BASIC";
}

export class AuthenticateUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private otpsRepository: OtpsRepository,
    private sessionsRepository: SessionsRepository,
    private encrypter: Encrypter,
    private hasher: Hasher
  ) {}

  async execute({
    email,
    password,
    agent,
    ip,
    type,
  }: AuthenticateUseCaseRequest) {
    const user = await this.usersRepository.find("user", { email });

    if (!user) throw new WrongCredentialsError();

    switch (type) {
      case "BASIC":
        if (!user.password) throw new MissingFieldError("senha");

        const isPasswordValid = await this.encrypter.compare(
          password,
          user.password
        );

        if (!isPasswordValid) throw new WrongCredentialsError();
        break;

      case "OTP":
        const otp = await this.otpsRepository.find("basic", {
          user: { id: user.id.value },
          value: password,
          used: false,
        });

        if (!otp || otp.value !== password) throw new WrongCredentialsError();

        otp.expire();

        await this.otpsRepository.update(otp);
        break;
    }

    if (!user.verified_at) throw new UserNotVerifiedError();

    const session = Session.create({
      user_id: user.id,
      agent,
      ip,
    });

    await this.sessionsRepository.create(session);

    const token = await this.hasher.hash({ user_id: user.id.value });

    return { user, token };
  }
}
