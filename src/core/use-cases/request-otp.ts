// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";
import { OtpsRepository } from "@/core/repositories/otps-repositoy";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { UserNotVerifiedError } from "@/core/errors/user-not-verified";

// Entities
import { Otp } from "@/core/entities/otp";
import { Message } from "@/core/entities/message";

// Mail
import { Mailer } from "@/core/mail/mailer";

interface RequestOtpUseCaseRequest {
  email: string;
}

export class RequestOtpUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private otpsRepository: OtpsRepository,
    private mailer: Mailer,
  ) {}

  async execute({ email }: RequestOtpUseCaseRequest) {
    const user = await this.usersRepository.find("user", {
      email,
    });

    if (!user) {
      throw new ResourceNotFoundError("Usuário", email);
    }

    if (!user.verified_at) {
      throw new UserNotVerifiedError();
    }

    const otp = Otp.create({ user_id: user.id });

    await this.otpsRepository.create(otp);

    const view = await this.mailer.load({
      view: "otp",
      props: { otp: otp.value },
    });

    const message = Message.create({
      to: user.email,
      subject: `Senha ${otp.value} | eCOO`,
      content: view,
    });

    this.mailer.send(message);
  }
}
