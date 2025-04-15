// Entities
import { User } from "@/core/entities/user";

// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";

// Errors
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";

// Entities
import { Phone } from "@/core/entities/phone";
import { CPF } from "@/core/entities/cpf";
import { Message } from "@/core/entities/message";

// Cryptography
import { Hasher } from "@/core/cryptography/hasher";
import { Encrypter } from "@/core/cryptography/encrypter";

// Mail
import { Mailer } from "@/core/mail/mailer";

interface RegisterUseCaseRequest {
  first_name: string;
  last_name: string;
  email: string;
  cpf: string;
  phone: string;
  password?: string;
  chat?: string;
  role: "USER" | "PRODUCER";
}

export class RegisterUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private encrypter: Encrypter,
    private hasher: Hasher,
    private mailer: Mailer,
  ) {}

  async execute({ first_name, last_name, email, cpf, phone, password, chat, role }: RegisterUseCaseRequest) {
    const userWithSameEmail = await this.usersRepository.find("user", {
      email,
    });

    if (userWithSameEmail) throw new ResourceAlreadyExistsError("Email", email);

    const userWithSamePhone = await this.usersRepository.find("user", {
      phone,
    });

    if (userWithSamePhone) throw new ResourceAlreadyExistsError("Telefone", phone);

    const userWithSameCpf = await this.usersRepository.find("user", { cpf });

    if (userWithSameCpf) throw new ResourceAlreadyExistsError("CPF", cpf);

    if (chat) {
      const userWithSameChat = await this.usersRepository.find("user", {
        chat,
      });

      if (userWithSameChat) throw new ResourceAlreadyExistsError("Chat", chat);
    }

    const user = User.create({
      first_name,
      last_name,
      email,
      chat,
      roles: role === "PRODUCER" ? ["USER", "PRODUCER"] : ["USER"],
      phone: new Phone(phone),
      cpf: new CPF(cpf),
    });

    if (password) user.password = await this.encrypter.encrypt(password);

    await this.usersRepository.create(user);

    const token = await this.hasher.hash({ user_id: user.id.value });

    const view = await this.mailer.load({
      view: "welcome",
      props: { first_name, token },
    });

    const message = Message.create({
      to: email,
      subject: "Bem-vindo | eCOO",
      content: view,
    });

    this.mailer.send([message]);
  }
}
