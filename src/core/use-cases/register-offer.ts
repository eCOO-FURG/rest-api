// Entities
import { Offer } from "@/core/entities/offer";

// Repositories
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { FarmsRepository } from "@/core/repositories/farms-repository";
import { ProductsRepository } from "@/core/repositories/products-repository";
import { OffersRepository } from "@/core/repositories/offers-repository";
import { MarketsRepository } from "@/core/repositories/markets-repository";

// Errors
import { InvalidWeightError } from "@/core/errors/invalid-weight";
import { MissingFieldError } from "@/core/errors/missing-field";
import { ResourceClosedError } from "@/core/errors/resource-closed";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";

// Utils
import { now } from "../utils/now";
import { first } from "@/core/utils/first";
import { last } from "@/core/utils/last";
import { inPeriodOf } from "@/core/utils/in-period-of";
import { UUID } from "../entities/aggregates/uuid";

interface RegisterOfferUseCaseRequest {
  farm_id: string;
  product_id: string;
  amount: number;
  price: number;
  cycle_id?: string;
  market_id?: string;
  recurring?: boolean;
  description?: string;
  comment?: string;
  expires_at?: Date;
}

export class RegisterOfferUseCase {
  constructor(
    private farmsRepository: FarmsRepository,
    private productsRepository: ProductsRepository,
    private cyclesRepository: CyclesRepository,
    private marketsRepository: MarketsRepository,
    private offersRepository: OffersRepository,
  ) {}

  async execute({
    farm_id,
    product_id,
    cycle_id,
    market_id,
    amount,
    price,
    description,
    comment,
    recurring,
    expires_at,
  }: RegisterOfferUseCaseRequest) {
    const farm = await this.farmsRepository.find("farm", { id: farm_id });

    if (!farm) {
      throw new ResourceNotFoundError("Fazenda", farm_id);
    }

    const product = await this.productsRepository.find("product", {
      id: product_id,
    });

    if (!product) {
      throw new ResourceNotFoundError("Produto", product_id);
    }

    if (!product.perishable && !expires_at) {
      throw new MissingFieldError("expires_at");
    }

    if (product.archived) {
      throw new ResourceClosedError("Produto", product_id);
    }

    if (product.pricing === "WEIGHT" && amount % 100 !== 0) {
      throw new InvalidWeightError("ofertado", product_id);
    }

    if (market_id) {
      const market = await this.marketsRepository.find("market", {
        id: market_id,
      });

      if (!market) {
        throw new ResourceNotFoundError("Mercado", market_id);
      }

      if (!market.open) {
        throw new ResourceClosedError("Mercado", market_id);
      }

      const offerAlreadyExists = await this.offersRepository.find("offer", {
        farm: { id: farm.id.value },
        product: { id: product.id.value },
        market: { id: market_id },
      });

      if (offerAlreadyExists) {
        throw new ResourceAlreadyExistsError(`Oferta do produto`, product_id);
      }
    }

    const offer = Offer.create({
      farm_id: farm.id,
      product_id: product.id,
      cycle_id: cycle_id ? new UUID(cycle_id) : null,
      market_id: market_id ? new UUID(market_id) : null,
      amount,
      price,
      description,
      comment,
      expires_at,
    });

    if (cycle_id) {
      const cycle = await this.cyclesRepository.find("cycle", { id: cycle_id });

      if (!cycle) {
        throw new ResourceNotFoundError("Ciclo", cycle_id);
      }

      if (!inPeriodOf("offer", cycle)) {
        throw new ResourceClosedError("Ciclo", cycle.id.value);
      }

      const offerAlreadyExists = await this.offersRepository.find("offer", {
        farm: { id: farm.id.value },
        product: { id: product.id.value },
        cycle: { id: cycle_id },
        ...(recurring ? { recurring } : { since: first(cycle.offer) }),
      });

      if (offerAlreadyExists) {
        throw new ResourceAlreadyExistsError(`Oferta do produto`, product_id);
      }

      if (!recurring) {
        offer.opens_at = first(cycle.order, last(cycle.order) < now());
        offer.closes_at = last(cycle.order, last(cycle.order) < now());
      }
    }

    await this.offersRepository.create(offer);
  }
}
