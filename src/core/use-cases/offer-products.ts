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
import { ClosedActionError } from "@/core/errors/closed-action";

// Utils
import { mostPast } from "@/core/utils/most-past";

interface OfferProductsUseCaseRequest {
  farm_id: string;
  product_id: string;
  cycle_id: string;
  amount: number;
  price: number;
  description?: string;
}

export class OfferProductsUseCase {
  constructor(
    private farmsRepository: FarmsRepository,
    private productsRepository: ProductsRepository,
    private catalogsRepository: CatalogsRepository,
    private offersRepository: OffersRepository,
    private cyclesRepository: CyclesRepository
  ) {}

  async execute({
    farm_id,
    product_id,
    cycle_id,
    amount,
    price,
    description,
  }: OfferProductsUseCaseRequest) {
    const farm = await this.farmsRepository.search({ id: farm_id }, "entity");

    if (!farm) throw new ResourceNotFoundError("Agronegócio", farm_id);

    if (!farm.active) throw new FarmNotActiveError();

    const product = await this.productsRepository.findById(product_id);

    if (!product) throw new ResourceNotFoundError("Produto", product_id);

    const cycle = await this.cyclesRepository.findById(cycle_id);

    if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    const today = (new Date().getDay() + 1) as Week[0];

    if (!cycle.offer.includes(today))
      throw new ClosedActionError("ofertar", cycle_id);

    const { catalog, created } = await this.useCatalog(farm.id, cycle);

    if (!created) {
      const alreadyOffered = await this.offersRepository.search(
        {
          catalog: { id: catalog.id.value },
          product: { id: product_id },
          since: mostPast(cycle.offer),
        },
        "entity"
      );

      if (alreadyOffered)
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

    await this.offersRepository.create(offer);
  }

  private async useCatalog(farm_id: UUID, cycle: Cycle) {
    const existent = await this.catalogsRepository.search(
      {
        farm: { id: farm_id.value },
        cycle: { id: cycle.id.value },
        since: mostPast(cycle.offer),
      },
      "entity"
    );

    if (existent) return { catalog: existent, created: false };

    const catalog = Catalog.create({ farm_id, cycle_id: cycle.id });

    await this.catalogsRepository.create(catalog);

    return { catalog, created: true };
  }
}
