// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Services
import { Encrypter } from "@/core/cryptography/encrypter";
import { Storage } from "@/core/storage/storage";

// Types
import { File } from "@/core/types/file";
import { CPF } from "../entities/cpf";
import { Phone } from "../entities/phone";

interface UpdateUserUseCaseRequest {
  user_id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  cpf?: string;
  phone?: string;
  password?: string;
  photo?: File;
  chat?: string;
}

export class UpdateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private encrypter: Encrypter,
    private storage: Storage
  ) {}

  async execute({
    user_id,
    first_name,
    last_name,
    email,
    cpf,
    phone,
    password,
    photo,
    chat
  }: UpdateUserUseCaseRequest) {
    const user = await this.usersRepository.find("basic", { id: user_id });

    if (!user) throw new ResourceNotFoundError("Usuário", user_id);

    user.first_name = first_name ?? user.first_name;
    user.last_name = last_name ?? user.last_name;
    user.email = email ?? user.email;
    user.cpf = new CPF(cpf ?? user.cpf.value);
    user.phone = new Phone(phone ?? user.phone.value);
    user.chat = chat ?? user.chat;

    if (password) user.password = await this.encrypter.encrypt(password);

    if (photo) {
      const urls = await this.storage.upload([photo], "users");

      user.photo = urls[0];
    }

    user.touch();

    await this.usersRepository.update(user);
  }
}
