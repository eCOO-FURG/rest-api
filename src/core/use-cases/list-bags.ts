// Repositories
import { BagsRepository } from "@/core/repositories/bags-repository";

interface ListBagsUseCaseRequest {
  user_id: string;
  page: number;
  since?: Date;
  before?: Date;
}

export class ListBagsUseCase {
  constructor(private bagsRepository: BagsRepository) {}

  async execute({ user_id, since, before, page }: ListBagsUseCaseRequest) {
    const bags = await this.bagsRepository.searchMany(
      {
        user: { id: user_id },
        since,
        before,
        page,
      },
      "aggregate"
    );

    return { bags };
  }
}
