// Repositories
import { CatalogsRepository } from "@/core/repositories/catalogs-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface FetchCatalogUseCaseRequest {
  catalog_id: string;
  page: number;
  product?: string;
}

export class FetchCatalogUseCase {
  constructor(private catalogsRepository: CatalogsRepository) {}

  async execute({ catalog_id, product, page }: FetchCatalogUseCaseRequest) {
    const catalog = await this.catalogsRepository.find("catalog-and-offers", {
      id: catalog_id,
      offers: { product: { name: product }, expired: false, page },
    });

    if (!catalog) throw new ResourceNotFoundError("Catálogo", catalog_id);

    return { catalog };
  }
}
