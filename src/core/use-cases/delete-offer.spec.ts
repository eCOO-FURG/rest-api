// Repositories
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";

// Use-case
import { DeleteOfferUseCase } from "./delete-offer";
import { makeCycle } from "@/test/factories/make-cycle";
import { makeProduct } from "@/test/factories/make-product";
import { makeFarm } from "@/test/factories/make-farm";
import { makeOffer } from "@/test/factories/make-offer";
import { makeCatalog } from "@/test/factories/make-catalog";

let farmsRepository: InMemoryFarmsRepository;
let cyclesRepository: InMemoryCyclesRepository;
let offersRepository: InMemoryOffersRepository;

let sut: DeleteOfferUseCase;

describe("delete offer", () => {
  beforeEach(() => {
    farmsRepository = new InMemoryFarmsRepository();
    cyclesRepository = new InMemoryCyclesRepository();
    offersRepository = new InMemoryOffersRepository();

    sut = new DeleteOfferUseCase(
      farmsRepository,
      cyclesRepository,
      offersRepository
    );
  });

  it("should be able to delete an offer", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const product = makeProduct();

    const farm = makeFarm({ status: "ACTIVE" });
    await farmsRepository.create(farm);

    const catalog = makeCatalog({
      farm_id: farm.id,
      cycle_id: cycle.id
    })

    const offer = makeOffer({
      product_id: product.id,
      catalog_id: catalog.id
    })
    offersRepository.items.push(offer);

    await sut.execute({
      farm_id: farm.id.value,
      offer_id: offer.id.value,
    });

    expect(offersRepository.items).toHaveLength(0);
  })
});
