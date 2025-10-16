// Entities
import { User } from "@/core/entities/user";
import { Producer } from "@/core/entities/aggregates/producer";
import { CPF } from "@/core/entities/cpf";
import { Phone } from "@/core/entities/phone";

// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";
import { FarmsRepository } from "@/core/repositories/farms-repository";

// Errors
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";

// Types
import { File } from "@/core/types/file";

interface RegisterProducerUseCaseRequest {
  first_name: string;
  last_name: string;
  email: string;
  cpf: string;
  phone: string;
  name: string;
  tally: string;
  chat?: string;
  photo?: File;
}

export class RegisterProducerUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private farmsRepository: FarmsRepository,
    private storage: Storage,
  ) {}

  async execute({
    first_name,
    last_name,
    email,
    cpf,
    phone,
    name,
    tally,
    chat,
    photo,
  }: RegisterProducerUseCaseRequest) {
    const userWithSameEmail = await this.usersRepository.find("user", {
      email,
    });

    if (userWithSameEmail) {
      throw new ResourceAlreadyExistsError("Email", email);
    }

    const userWithSamePhone = await this.usersRepository.find("user", {
      phone,
    });

    if (userWithSamePhone) {
      throw new ResourceAlreadyExistsError("Telefone", phone);
    }

    const userWithSameCpf = await this.usersRepository.find("user", { cpf });

    if (userWithSameCpf) {
      throw new ResourceAlreadyExistsError("CPF", cpf);
    }

    if (chat) {
      const userWithSameChat = await this.usersRepository.find("user", {
        chat,
      });

      if (userWithSameChat) {
        throw new ResourceAlreadyExistsError("Chat", chat);
      }
    }

    const farmWithSameTally = await this.farmsRepository.find("farm", {
      tally,
    });

    if (farmWithSameTally) {
      throw new ResourceAlreadyExistsError("Número do Talão", tally);
    }

    const user = User.create({
      first_name,
      last_name,
      email,
      chat,
      roles: ["USER", "PRODUCER"],
      phone: new Phone(phone),
      cpf: new CPF(cpf),
    });

    if (photo) {
      const urls = await this.storage.upload([photo], "users");

      user.photo = urls[0];
    }

    const producer = Producer.create({
      name,
      tally,
      admin_id: user.id,
      admin: user,
    });

    await this.farmsRepository.create(producer);
  }
}
