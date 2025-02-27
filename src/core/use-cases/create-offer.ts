// Entities
import { Catalog } from "@/core/entities/catalog";
import { Cycle, Week } from "@/core/entities/cycle";
import { Farm } from "@/core/entities/farm";
import { Offer } from "@/core/entities/offer";

// Repositories
import { CatalogsRepository } from "@/core//repositories/catalogs-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { FarmsRepository } from "@/core/repositories/farms-repository";
import { ProductsRepository } from "@/core/repositories/products-repository";

// Errors
import { FarmNotActiveError } from "@/core/errors/farm-not-active";
import { InvalidWeightError } from "@/core/errors/invalid-weight";
import { MissingFieldError } from "@/core/errors/missing-field";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";
import { ResourceClosedError } from "@/core/errors/resource-closed";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Utils
import { mostPast } from "@/core/utils/most-past";

interface CreateOfferUseCaseRequest {
  farm_id: string;
  product_id: string;
  cycle_id: string;
  amount: number;
  price: number;
  description?: string;
  expires_at?: Date;
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
    expires_at,
  }: CreateOfferUseCaseRequest) {
    const farm = await this.farmsRepository.find("basic", { id: farm_id });

    if (!farm) throw new ResourceNotFoundError("Fazenda", farm_id);

    if (farm.status !== "ACTIVE") throw new FarmNotActiveError();

    const product = await this.productsRepository.find("basic", {
      id: product_id,
    });

    if (!product) throw new ResourceNotFoundError("Produto", product_id);

    if (product.perishable && !expires_at)
      throw new MissingFieldError("expires_at");

    const cycle = await this.cyclesRepository.find("basic", { id: cycle_id });

    if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    const today = (new Date().getDay() + 1) as Week[0];

    if (!cycle.offer.includes(today))
      throw new ResourceClosedError("Ciclo", cycle.id.value);

    const { catalog, existed } = await this.useCatalog(farm, cycle);

    if (existed) {
      const offered = Array.from(catalog.offers.values()).find(
        (offer) => offer.product_id.value === product_id
      );

      if (offered)
        throw new ResourceAlreadyExistsError("Oferta do produto", product_id);
    }

    if (product.pricing === "WEIGHT" && amount % 1000 !== 0)
      throw new InvalidWeightError("ofertado", product_id);

    const offer = Offer.create({
      catalog_id: catalog.id,
      product_id: product.id,
      amount,
      price: price + (price * farm.tax) / 100,
      description,
      expires_at,
    });

    catalog.offers.set(product_id, offer);

    if (existed) return await this.catalogsRepository.update(catalog);

    await this.catalogsRepository.create(catalog);
  }

  private async useCatalog(farm: Farm, cycle: Cycle) {
    const existent = await this.catalogsRepository.find("merge", {
      farm: { id: farm.id.value },
      cycle: { id: cycle.id.value },
      since: mostPast(cycle.offer),
    });

    if (existent) return { catalog: existent, existed: true };

    const catalog = Catalog.create({
      tax: farm.tax,
      farm_id: farm.id,
      cycle_id: cycle.id,
    });

    return { catalog, existed: false };
  }
}
