// Repositories
import { FarmsRepository } from "@/core/repositories/farms-repository";
import { UsersRepository } from "@/core/repositories/users-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";

// Types
import { File } from "@/core/types/file";

// Entities
import { CPF } from "@/core/entities/cpf";
import { Phone } from "@/core/entities/phone";

interface UpdateProducerUseCaseRequest {
  farm_id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  cpf?: string;
  phone?: string;
  name?: string;
  tally?: string;
  chat?: string;
  photo?: File;
}

export class UpdateProducerUseCase {
  constructor(
    private farmsRepository: FarmsRepository,
    private usersRepository: UsersRepository,
    private storage: Storage,
  ) {}

  async execute({
    farm_id,
    first_name,
    last_name,
    email,
    cpf,
    phone,
    name,
    tally,
    chat,
    photo,
  }: UpdateProducerUseCaseRequest) {
    const producer = await this.farmsRepository.find("producer", { id: farm_id });

    if (!producer) {
      throw new ResourceNotFoundError("Fazenda", farm_id);
    }

    if (email) {
      const userWithSameEmail = await this.usersRepository.find("user", {
        email,
      });

      if (userWithSameEmail && !userWithSameEmail.id.equals(producer.admin.id)) {
        throw new ResourceAlreadyExistsError("Usuário", "com esse email");
      }
    }

    if (cpf) {
      const userWithSameCpf = await this.usersRepository.find("user", {
        cpf,
      });

      if (userWithSameCpf && !userWithSameCpf.id.equals(producer.admin.id)) {
        throw new ResourceAlreadyExistsError("Usuário", "com esse CPF");
      }
    }

    if (phone) {
      const userWithSamePhone = await this.usersRepository.find("user", {
        phone,
      });

      if (userWithSamePhone && !userWithSamePhone.id.equals(producer.admin.id)) {
        throw new ResourceAlreadyExistsError("Usuário", "com esse telefone");
      }
    }

    if (tally) {
      const producerWithSameTally = await this.farmsRepository.find("producer", {
        tally,
      });

      if (producerWithSameTally) {
        throw new ResourceAlreadyExistsError("Número do Talão", tally);
      }
    }

    if (photo) {
      const urls = await this.storage.upload([photo], "users");

      producer.admin.photo = urls[0];
    }

    producer.admin.first_name = first_name ?? producer.admin.first_name;
    producer.admin.last_name = last_name ?? producer.admin.last_name;
    producer.admin.email = email ?? producer.admin.email;
    producer.admin.chat = chat ?? producer.admin.chat;
    producer.admin.cpf = cpf ? new CPF(cpf) : producer.admin.cpf;
    producer.admin.phone = phone ? new Phone(phone) : producer.admin.phone;
    producer.name = name ?? producer.name;
    producer.tally = tally ?? producer.tally;

    producer.touch();

    await this.farmsRepository.update(producer);
  }
}
