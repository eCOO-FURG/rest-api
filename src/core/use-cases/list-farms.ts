// Repositories
import { FarmsRepository } from "@/core/repositories/farms-repository";

interface ListFarmsProps {
  page: number;
  name?: string;
}

export class ListFarmsUseCase {
  constructor(private farmsRepository: FarmsRepository) {}

  async execute({ page, name }: ListFarmsProps) {
    const farms = await this.farmsRepository.searchMany(
      { page, name },
      "aggregate"
    );

    return {
      farms,
    };
  }
}
