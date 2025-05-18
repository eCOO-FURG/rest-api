// Repositories
import { CatalogsRepository } from "@/core/repositories/catalogs-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface FetchCatalogUseCaseRequest {
  catalog_id: string;
  page: number;
  product?: string;
  available?: boolean;
  since?: Date;
  before?: Date;
}

export class FetchCatalogUseCase {
  constructor(private catalogsRepository: CatalogsRepository) {}

  async execute({ catalog_id, product, page, available, since, before }: FetchCatalogUseCaseRequest) {
    const catalog = await this.catalogsRepository.find("catalog-and-offers", {
      id: catalog_id,
      offers: { product: { name: product }, available, since, before, page },
    });

    if (!catalog) throw new ResourceNotFoundError("Catálogo", catalog_id);

    return { catalog };
  }
}
