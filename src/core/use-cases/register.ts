// Entities
import { Role, User } from "@/core/entities/user";

// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";

// Services
import { Encrypter } from "@/core/cryptography/encrypter";

// Errors
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";

// Events
import { DomainEvents } from "@/core/events/domain-events";

// Entities
import { Phone } from "@/core/entities/phone";
import { CPF } from "@/core/entities/cpf";

interface RegisterUseCaseRequest {
  first_name: string;
  last_name: string;
  email: string;
  cpf: string;
  phone: string;
  password?: string;
  chat?: string | null;
  role: "USER" | "PRODUCER";
}

export class RegisterUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private encrypter: Encrypter
  ) { }

  async execute({
    first_name,
    last_name,
    email,
    cpf,
    phone,
    password,
    chat,
    role,
  }: RegisterUseCaseRequest) {
    const userWithSameEmail = await this.usersRepository.find("basic", {
      email,
    });

    if (userWithSameEmail) throw new ResourceAlreadyExistsError("Email", email);

    const userWithSamePhone = await this.usersRepository.find("basic", {
      phone,
    });

    if (userWithSamePhone)
      throw new ResourceAlreadyExistsError("Telefone", phone);

    const userWithSameCpf = await this.usersRepository.find("basic", {
      cpf,
    });

    if (userWithSameCpf) throw new ResourceAlreadyExistsError("CPF", cpf);

    if (chat) {
      const userWithSameChat = await this.usersRepository.find("basic", {
        chat,
      });

      if (userWithSameChat) throw new ResourceAlreadyExistsError("Chat", chat);

    }

    const roles: Role[] = role === "PRODUCER" ? ["USER", "PRODUCER"] : ["USER"];

    const user = User.create({
      first_name,
      last_name,
      cpf: new CPF(cpf),
      email,
      phone: new Phone(phone),
      chat: chat ?? null,
      roles,
    });

    if (password) user.password = await this.encrypter.encrypt(password);

    await this.usersRepository.create(user);

    DomainEvents.dispatch(user);
  }
}
