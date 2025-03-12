// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";
import { OtpsRepository } from "@/core/repositories/otps-repositoy";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Entities
import { Otp } from "@/core/entities/otp";
import { Message } from "@/core/entities/message";

// Mail
import { Mailer } from "@/core/mail/mailer";

// Cryptography
import { OtpProvider } from "@/core/cryptography/otp-provider";

interface RequestOtpUseCaseRequest {
  email: string;
}

export class RequestOtpUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private otpGenerator: OtpProvider,
    private otpsRepository: OtpsRepository,
    private mailer: Mailer
  ) {}

  async execute({ email }: RequestOtpUseCaseRequest) {
    const user = await this.usersRepository.find("basic", {
      email,
    });

    if (!user) throw new ResourceNotFoundError("Usuário", email);

    const otp = Otp.create({
      user_id: user.id,
      value: await this.otpGenerator.generate(),
    });

    await this.otpsRepository.create(otp);

    const view = await this.mailer.load({
      view: "otp",
      props: { otp: otp.value },
    });

    const message = Message.create({
      to: user.email,
      subject: "Senha de acesso | eCOO",
      content: view,
    });

    this.mailer.send([message]);
  }
}
