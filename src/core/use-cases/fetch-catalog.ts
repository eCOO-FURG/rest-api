// Repositories
import { CatalogsRepository } from "@/core/repositories/catalogs-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface FetchCatalogUseCaseRequest {
  catalog_id: string;
  page: number;
  product?: string;
  sort?: "asc" | "desc";
}

export class FetchCatalogUseCase {
  constructor(private catalogsRepository: CatalogsRepository) {}

  async execute({ catalog_id, product, page, sort, }: FetchCatalogUseCaseRequest) {
    const catalog = await this.catalogsRepository.search(
      {
        id: catalog_id,
        offer: { product: { name: product }, page },
        sort: {
          field: "offers.product.name",
          order: sort ?? "asc",
        },
      },
      "merged"
    );

    if (!catalog) throw new ResourceNotFoundError("Catálogo", catalog_id);

    return {
      catalog,
    };
  }
}
