// Entities
import { User } from "@/core/entities/user";

// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";

// Services
import { Encrypter } from "@/core/cryptography/encrypter";

// Errors
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";

// Events
import { DomainEvents } from "../events/domain-events";

interface RegisterUseCaseRequest {
  first_name: string;
  last_name: string;
  email: string;
  cpf: string;
  phone: string;
  password?: string;
}

export class RegisterUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private encrypter: Encrypter
  ) {}

  async execute({
    first_name,
    last_name,
    email,
    cpf,
    phone,
    password,
  }: RegisterUseCaseRequest) {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new ResourceAlreadyExistsError("Email", email);
    }

    const userWithSamePhone = await this.usersRepository.findByPhone(phone);

    if (userWithSamePhone) {
      throw new ResourceAlreadyExistsError("Telefone", phone);
    }

    const userWithSameCpf = await this.usersRepository.findByCpf(cpf);

    if (userWithSameCpf) {
      throw new ResourceAlreadyExistsError("CPF", cpf);
    }

    const user = User.create({
      first_name,
      last_name,
      cpf,
      email,
      phone,
      roles: ["USER"],
    });

    if (password) {
      const hash = await this.encrypter.encrypt(password);
      user.password = hash;
    }

    await this.usersRepository.create(user);

    DomainEvents.dispatch(user);
  }
}
