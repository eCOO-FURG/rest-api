// Entities
import { User } from "@/core/entities/user";
import { Email } from "@/core/entities/email";

// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";

// Services
import { Encrypter } from "@/core/cryptography/encrypter";
import { Mailer } from "@/core/mail/mailer";

// Errors
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";

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
    private encrypter: Encrypter,
    private mailer: Mailer
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

    const view = await this.mailer.load("welcome", user);

    const mail = Email.create({
      to: email,
      from: "suporte@ecoo.com",
      subject: "Bem-vindo | ecOO",
      view,
    });

    await this.mailer.send(mail);
  }
}
