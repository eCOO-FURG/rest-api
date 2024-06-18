// Entities
import { Offer } from "@/core/entities/offer";
import { Week } from "@/core/entities/cycle";

// Repositories
import { FarmsRepository } from "@/core/repositories/farms-repository";
import { ProductsRepository } from "@/core/repositories/products-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { OffersRepository } from "@/core/repositories/offers-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";
import { FarmNotActiveError } from "@/core/errors/farm-not-active";
import { InvalidWeightError } from "@/core/errors/invalid-weight";
import { ClosedActionError } from "@/core/errors/closed-action";

// Utils
import { mostDistant } from "@/core/utils/most-distant";

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
    const farm = await this.farmsRepository.findById(farm_id);

    if (!farm) throw new ResourceNotFoundError("Agronegócio", farm_id);

    if (!farm.active) throw new FarmNotActiveError();

    const product = await this.productsRepository.findById(product_id);

    if (!product) throw new ResourceNotFoundError("Produto", product_id);

    const cycle = await this.cyclesRepository.findById(cycle_id);

    if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    const today = (new Date().getDay() + 1) as Week[0];

    if (!cycle.offer.includes(today)) {
      throw new ClosedActionError("ofertar", cycle_id);
    }

    const alreadyOffered = await this.offersRepository.find({
      cycle_id,
      product_id,
      farm_id,
      created_at: mostDistant(cycle.offer),
    });

    if (alreadyOffered)
      throw new ResourceAlreadyExistsError("Oferta de", product_id);

    if (product.pricing === "WEIGHT" && amount % 50 !== 0) {
      throw new InvalidWeightError("ofertado", product_id);
    }

    const offer = Offer.create({
      farm_id: farm.id,
      product_id: product.id,
      cycle_id: cycle.id,
      amount,
      price,
      description,
    });

    await this.offersRepository.create(offer);
  }
}
