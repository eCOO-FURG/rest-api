// Entities
import { Catalog } from "@/core/entities/catalog";
import { Cycle } from "@/core/entities/cycle";
import { Farm } from "@/core/entities/farm";
import { Offer } from "@/core/entities/offer";

// Repositories
import { CatalogsRepository } from "@/core//repositories/catalogs-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { FarmsRepository } from "@/core/repositories/farms-repository";
import { ProductsRepository } from "@/core/repositories/products-repository";
import { OffersRepository } from "@/core/repositories/offers-repository";

// Errors
import { FarmNotActiveError } from "@/core/errors/farm-not-active";
import { InvalidWeightError } from "@/core/errors/invalid-weight";
import { MissingFieldError } from "@/core/errors/missing-field";
import { ResourceClosedError } from "@/core/errors/resource-closed";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";

// Utils
import { first } from "@/core/utils/first";
import { today } from "@/core/utils/today";
import { last } from "@/core/utils/last";

interface RegisterOfferUseCaseRequest {
  farm_id: string;
  product_id: string;
  cycle_id: string;
  amount: number;
  price: number;
  recurring?: boolean;
  description?: string;
  comment?: string;
  expires_at?: Date;
}

export class RegisterOfferUseCase {
  constructor(
    private farmsRepository: FarmsRepository,
    private productsRepository: ProductsRepository,
    private catalogsRepository: CatalogsRepository,
    private cyclesRepository: CyclesRepository,
    private offersRepository: OffersRepository,
  ) {}

  async execute({
    farm_id,
    product_id,
    cycle_id,
    amount,
    price,
    description,
    comment,
    recurring,
    expires_at,
  }: RegisterOfferUseCaseRequest) {
    const farm = await this.farmsRepository.find("farm", { id: farm_id });

    if (!farm) throw new ResourceNotFoundError("Fazenda", farm_id);

    if (farm.status !== "ACTIVE") throw new FarmNotActiveError();

    const product = await this.productsRepository.find("product", {
      id: product_id,
    });

    if (!product) throw new ResourceNotFoundError("Produto", product_id);

    if (!product.perishable && !expires_at) throw new MissingFieldError("expires_at");

    if (product.archived) throw new ResourceClosedError("Produto", product_id);

    const cycle = await this.cyclesRepository.find("cycle", { id: cycle_id });

    if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    if (!cycle.offer.includes(today())) throw new ResourceClosedError("Ciclo", cycle.id.value);

    const { catalog, existed } = await this.useCatalog(farm, cycle);

    if (existed) {
      const previous = await this.offersRepository.find("offer", {
        product: { id: product.id.value },
        catalog: { id: catalog.id.value },
        ...(recurring ? { recurring } : { since: first(cycle.offer) }),
      });

      if (previous) throw new ResourceAlreadyExistsError(`Oferta do produto`, product_id);
    }

    if (product.pricing === "WEIGHT" && amount % 1000 !== 0) throw new InvalidWeightError("ofertado", product_id);

    const offer = Offer.create({
      catalog_id: catalog.id,
      product_id: product.id,
      amount,
      price,
      recurring,
      description,
      comment,
      expires_at,
      closes_at: last(cycle.offer),
      fee: price * (catalog.fee / 100),
    });

    catalog.offers.push(offer);

    if (existed) return await this.catalogsRepository.update(catalog);

    return await this.catalogsRepository.create(catalog);
  }

  private async useCatalog(farm: Farm, cycle: Cycle) {
    const existent = await this.catalogsRepository.find("catalog", {
      farm: { id: farm.id.value },
      cycle: { id: cycle.id.value },
    });

    if (existent) return { catalog: existent, existed: true };

    const catalog = Catalog.create({
      fee: farm.fee,
      farm_id: farm.id,
      cycle_id: cycle.id,
    });

    return { catalog, existed: false };
  }
}
