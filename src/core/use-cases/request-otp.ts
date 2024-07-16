// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";
import { OtpsRepository } from "../repositories/otps-repositoy";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Entities
import { Otp } from "@/core/entities/otp";

// Services
import { OtpProvider } from "@/core/cryptography/otp-provider";
import { DomainEvents } from "../events/domain-events";

interface RequestOtpUseCaseRequest {
  email: string;
}

export class RequestOtpUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private otpGenerator: OtpProvider,
    private otpsRepository: OtpsRepository,
  ) { }

  async execute({ email }: RequestOtpUseCaseRequest) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) throw new ResourceNotFoundError("Usuário", email);

    const otp = Otp.create({
      user_id: user.id,
      value: await this.otpGenerator.generate()
    });

    await this.otpsRepository.create(otp);

    DomainEvents.dispatch(otp);
  }
}