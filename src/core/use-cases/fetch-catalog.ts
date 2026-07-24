// Entities
// Repositories
import { CatalogOffersAvailability, FarmsRepository } from "@/core/repositories/farms-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface FetchCatalogUseCaseRequest {
  farm_id: string;
  page: number;
  cycle_id?: string;
  product?: string;
  remaining?: boolean;
  available?: CatalogOffersAvailability;
  since?: Date;
  before?: Date;
}

export class FetchCatalogUseCase {
  constructor(private farmsRepository: FarmsRepository) {}

  async execute({
    farm_id,
    cycle_id,
    product,
    page,
    remaining,
    available,
    since,
    before,
  }: FetchCatalogUseCaseRequest) {
    const filterByCreationPeriod = available !== "CYCLE" && available !== "CYCLE_WITH_SCHEDULED";

    const catalog = await this.farmsRepository.find("catalog", {
      id: farm_id,
      offers: {
        cycle: { id: cycle_id },
        product: { name: product },
        remaining,
        available,
        since: filterByCreationPeriod ? since : undefined,
        before: filterByCreationPeriod ? before : undefined,
        page,
      },
    });

    if (!catalog) {
      throw new ResourceNotFoundError("Catálogo", farm_id);
    }

    if (available === false) {
      const seen = new Set<string>();
      catalog.offers = catalog.offers.filter((offer) => {
        const pid = offer.product?.id?.value ?? offer.product?.id;
        if (!pid || seen.has(pid)) {return false;}
        seen.add(pid);
        return true;
      });
    }

    return { catalog };
  }
}
