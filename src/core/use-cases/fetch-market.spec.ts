// Use-cases
import { FetchMarketUseCase } from "@/core/use-cases/fetch-market";

// Factories
import { makeMarket } from "@/test/factories/make-market";

// Repositories
import { InMemoryMarketsRepository } from "@/test/repositories/in-memory-markets-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

let marketsRepository: InMemoryMarketsRepository;
let sut: FetchMarketUseCase;

describe("fetch market", () => {
  beforeEach(() => {
    marketsRepository = new InMemoryMarketsRepository();
    sut = new FetchMarketUseCase(marketsRepository);
  });

  it("should be able to fetch a market", async () => {
    const market = makeMarket({ open: true });
    marketsRepository.items.push(market);

    const result = await sut.execute({
      market_id: market.id.value,
    });

    expect(result.market).toBeDefined();
    expect(result.market.id).toEqual(market.id);
    expect(result.market.open).toBe(true);
  });

  it("should be able to fetch a closed market", async () => {
    const market = makeMarket({ open: false });
    marketsRepository.items.push(market);

    const result = await sut.execute({
      market_id: market.id.value,
    });

    expect(result.market).toBeDefined();
    expect(result.market.id).toEqual(market.id);
    expect(result.market.open).toBe(false);
  });

  it("should not be able to fetch a nonexistent market", async () => {
    await expect(() =>
      sut.execute({
        market_id: "nonexistent-market-id",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should return market with correct properties", async () => {
    const market = makeMarket({
      name: "Mercado Central",
      open: true,
    });
    marketsRepository.items.push(market);

    const result = await sut.execute({
      market_id: market.id.value,
    });

    expect(result.market).toEqual(
      expect.objectContaining({
        id: market.id,
        name: "Mercado Central",
        open: true,
      }),
    );
  });
});
