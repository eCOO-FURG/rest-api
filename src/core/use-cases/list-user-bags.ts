// Repositories
import { BagsRepository } from "@/core/repositories/bags-repository";
import { UsersRepository } from "@/core/repositories/users-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface ListUserBagsRequest {
  user_id: string;
  date: string;
  page: number;
}

export class ListUserBagsUseCase {
  constructor(
    private bagsRepository: BagsRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({ user_id, date, page }: ListUserBagsRequest) {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new ResourceNotFoundError("Usuário", user_id);

    const [day, month, year] = date.split("-").map(Number);
    const _date = new Date(year, month - 1, day, 0, 0, 0, 0);

    const bags = await this.bagsRepository.searchMany(
      {
        user: {
          id: user_id,
        },
        since: _date,
        page,
      },
      "aggregate"
    );

    return { bags };
  }
}
