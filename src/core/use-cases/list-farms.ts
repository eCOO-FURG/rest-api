// Repositories
import { FarmsRepository } from "@/core/repositories/farms-repository";

interface ListFarmsUseCaseRequest {
  name?: string;
  page: number;
}

export class ListFarmsUseCase {
  constructor(private farmsRepository: FarmsRepository) {}

  async execute({ page, name }: ListFarmsUseCaseRequest) {
    const farms = await this.farmsRepository.list(
      "aggregate",
      {
        name,
      },
      page
    );

    return { farms };
  }
}
