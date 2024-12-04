// Entities
import { Offer } from "@/core/entities/offer";
import { Cycle, Week } from "@/core/entities/cycle";
import { Catalog } from "@/core/entities/catalog";
import { UUID } from "@/core/entities/aggregates/uuid";

// Repositories
import { FarmsRepository } from "@/core/repositories/farms-repository";
import { ProductsRepository } from "@/core/repositories/products-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { OffersRepository } from "@/core/repositories/offers-repository";
import { CatalogsRepository } from "@/core//repositories/catalogs-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";
import { FarmNotActiveError } from "@/core/errors/farm-not-active";
import { InvalidWeightError } from "@/core/errors/invalid-weight";
import { ResourceClosedError } from "@/core/errors/resource-closed";

// Utils
import { mostPast } from "@/core/utils/most-past";

interface CreateOfferUseCaseRequest {
  farm_id: string;
  product_id: string;
  cycle_id: string;
  amount: number;
  price: number;
  description?: string;
}

export class CreateOfferUseCase {
  constructor(
    private farmsRepository: FarmsRepository,
    private productsRepository: ProductsRepository,
    private catalogsRepository: CatalogsRepository,
    private cyclesRepository: CyclesRepository
  ) {}

  async execute({
    farm_id,
    product_id,
    cycle_id,
    amount,
    price,
    description,
  }: CreateOfferUseCaseRequest) {
    const farm = await this.farmsRepository.find("basic", { id: farm_id });

    if (!farm) throw new ResourceNotFoundError("Fazenda", farm_id);

    if (farm.status !== "ACTIVE") throw new FarmNotActiveError();

    const product = await this.productsRepository.find("basic", {
      id: product_id,
    });

    if (!product) throw new ResourceNotFoundError("Produto", product_id);

    const cycle = await this.cyclesRepository.find("basic", { id: cycle_id });

    if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    const today = (new Date().getDay() + 1) as Week[0];

    if (!cycle.offer.includes(today))
      throw new ResourceClosedError("Ciclo", cycle.id.value);

    const { catalog, existed } = await this.useCatalog(farm.id, cycle);

    if (existed) {
      const offered = catalog.offers.find(
        (offer) => offer.product_id.value === product_id
      );

      if (offered)
        throw new ResourceAlreadyExistsError("Oferta do produto", product_id);
    }

    if (product.pricing === "WEIGHT" && amount % 100 !== 0)
      throw new InvalidWeightError("ofertado", product_id);

    const offer = Offer.create({
      catalog_id: catalog.id,
      product_id: product.id,
      amount,
      description,
      price: price + (price * farm.tax) / 100,
    });

    catalog.offers.push(offer);

    if (existed) return await this.catalogsRepository.update(catalog);

    await this.catalogsRepository.create(catalog);
  }

  private async useCatalog(farm_id: UUID, cycle: Cycle) {
    const existent = await this.catalogsRepository.find("merge", {
      farm: { id: farm_id.value },
      cycle: { id: cycle.id.value },
      since: mostPast(cycle.offer),
    });

    if (existent) return { catalog: existent, existed: true };

    const catalog = Catalog.create({ farm_id, cycle_id: cycle.id });

    return { catalog, existed: false };
  }
}
