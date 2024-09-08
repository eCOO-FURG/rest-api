// Repositories
import { FarmsRepository } from "@/core/repositories/farms-repository";

interface ListFarmsUseCaseRequest {
  page: number;
  farm?: string;
}

export class ListFarmsUseCase {
  constructor(private farmsRepository: FarmsRepository) {}

  async execute({ page, farm }: ListFarmsUseCaseRequest) {
    const farms = await this.farmsRepository.searchMany(
      { page, farm },
      "aggregate"
    );

    return {
      farms,
    };
  }
}
