// Repositories
import { FarmsRepository } from "@/core/repositories/farms-repository";

interface ListFarmsUseCaseRequest {
  page: number;
  name?: string;
}

export class ListFarmsUseCase {
  constructor(private farmsRepository: FarmsRepository) {}

  async execute({ page, name }: ListFarmsUseCaseRequest) {
    const farms = await this.farmsRepository.searchMany(
      { page, name },
      "aggregate"
    );

    return {
      farms,
    };
  }
}
