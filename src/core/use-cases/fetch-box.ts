// Repositories
import { InMemoryBoxesRepository } from "@/test/repositories/in-memory-boxes-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface FetchBoxUseCaseRequest {
  box_id: string;
}

export class FetchBoxUseCase {
  constructor(private boxesRepository: InMemoryBoxesRepository) {}

  async execute({ box_id }: FetchBoxUseCaseRequest) {
    const box = await this.boxesRepository.search({ id: box_id }, "merged");

    if (!box) throw new ResourceNotFoundError("Caixa", box_id);

    return {
      box,
    };
  }
}
