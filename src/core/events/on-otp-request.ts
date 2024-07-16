import { Email } from "../entities/email";
import { ResourceNotFoundError } from "../errors/resource-not-found";
import { Mailer } from "../mail/mailer";
import { UsersRepository } from "../repositories/users-repository";
import { DomainEvents } from "./domain-events";

interface OnOtpRequestEventRequest {
  user_id: string;
  value: string;
}

export class OnOtpRequestEvent {
  constructor(private usersRepository: UsersRepository, private mailer: Mailer) { }

  setup() {
    DomainEvents.register(OnOtpRequestEvent.name, this.execute.bind(this))
  }

  async execute({
    user_id,
    value
  }: OnOtpRequestEventRequest) {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new ResourceNotFoundError("Usuário", user_id);

    const view = await this.mailer.load({
      view: "otp-request",
      props: {
        otp: value
      }
    })

    const mail = Email.create({
      to: user.email,
      subject: "Senha para acesso | eCOO",
      content: view
    })

    await this.mailer.send(mail);
  }
}