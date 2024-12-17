import { InMemoryBagsRepository } from "@/test/repositories/in-memory-bags-repository";

// Use-cases
import { FetchSalesStatsUseCase } from "@/core/use-cases/fetch-sales-stats";

// Factories
import { makeBag } from "@/test/factories/make-bag";
import { makeProduct } from "@/test/factories/make-product";
import { makeOrder } from "@/test/factories/make-order";
import { makeOffer } from "@/test/factories/make-offer";

let bagsRepository: InMemoryBagsRepository;
let sut: FetchSalesStatsUseCase;

describe("Fetch sales stats", () => {
  beforeEach(() => {
    bagsRepository = new InMemoryBagsRepository();
    sut = new FetchSalesStatsUseCase(bagsRepository);
  });

  it("should be able to fetch sales stats", async () => {
    const product = makeProduct();
    const offer = makeOffer({
      product,
      price: 10,
    });

    const order = makeOrder({ offer, amount: 10 });

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const ONE_MONTH_AGO = new Date(2024, currentMonth, 1);
    const TWO_MONTHS_AGO = new Date(2024, currentMonth - 1, 2);
    const THREE_MONTHS_AGO = new Date(2024, currentMonth - 2, 3);
    const FOUR_MONTHS_AGO = new Date(2024, currentMonth - 3, 4);
    const FIVE_MONTHS_AGO = new Date(2024, currentMonth - 4, 5);

    for (let i = 0; i < 10; i++) {
      const bag = makeBag({
        orders: new Map([[order.id.value, order]]),
        created_at: FIVE_MONTHS_AGO,
      });

      await bagsRepository.create(bag);
    }

    for (let i = 0; i < 10; i++) {
      const bag = makeBag({
        orders: new Map([[order.id.value, order]]),
        created_at: FOUR_MONTHS_AGO,
      });
      await bagsRepository.create(bag);
    }

    for (let i = 0; i < 10; i++) {
      const bag = makeBag({
        orders: new Map([[order.id.value, order]]),
        created_at: THREE_MONTHS_AGO,
      });
      await bagsRepository.create(bag);
    }

    for (let i = 0; i < 10; i++) {
      const bag = makeBag({
        orders: new Map([[order.id.value, order]]),
        created_at: TWO_MONTHS_AGO,
      });
      await bagsRepository.create(bag);
    }

    for (let i = 0; i < 10; i++) {
      const bag = makeBag({
        orders: new Map([[order.id.value, order]]),
        created_at: ONE_MONTH_AGO,
      });
      await bagsRepository.create(bag);
    }

    const { revenue, monthly, daily } = await sut.execute();

    expect(revenue).toBe(1000);
    expect(Object.keys(monthly).length).toBe(5);
    expect(Object.keys(daily).length).toBe(5);
  });
});
