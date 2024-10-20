// Repositories
import { BagsRepository } from "@/core/repositories/bags-repository";

interface ListUserBagsRequest {
  user_id: string;
  since?: Date;
  before?: Date;
  page: number;
}

export class ListUserBagsUseCase {
  constructor(private bagsRepository: BagsRepository) {}

  async execute({ user_id, since, before, page }: ListUserBagsRequest) {
    console.log(user_id);
    const bags = await this.bagsRepository.searchMany(
      {
        user: {
          id: user_id,
        },
        since,
        before,
        page,
      },
      "aggregate"
    );

    return { bags };
  }
}
