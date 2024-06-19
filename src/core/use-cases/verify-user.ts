// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { UserAlreadyVerified } from "@/core/errors/user-already-verified";

interface VerifyUserUsecaseRequest{
  user_id: string
}

export class VerifyUserUsecase{
  constructor(private usersRepository: UsersRepository){}

  async execute({ user_id }:  VerifyUserUsecaseRequest){
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new ResourceNotFoundError("Usuário", user_id);
    }

    if(user.verified_at){
      throw new UserAlreadyVerified("Usuário", user_id)
    }

    user.verify()

    await this.usersRepository.update(user)
  } 
}