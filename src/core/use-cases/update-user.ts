// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Services
import { Encrypter } from "@/core/cryptography/encrypter";
import { Storage } from "@/core/storage/storage";

interface UpdateUserUseCaseRequest {
  user_id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  cpf?: string;
  phone?: string;
  password?: string;
  photo?: Buffer;
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
  }: UpdateUserUseCaseRequest) {
    const user = await this.usersRepository.find("basic", { id: user_id });

    if (!user) throw new ResourceNotFoundError("Usuário", user_id);

    user.first_name = first_name ?? user.first_name;
    user.last_name = last_name ?? user.last_name;
    user.email = email ?? user.email;
    user.cpf = cpf ?? user.cpf;
    user.phone = phone ?? user.phone;

    if (password) user.password = await this.encrypter.encrypt(password);

    if (photo) {
      const urls = await this.storage.upload([photo], "users");

      user.photo = urls[0];
    }

    user.touch();

    await this.usersRepository.update(user);
  }
}
