// Use-cases
import { ListMarketsUseCase } from "@/core/use-cases/list-markets";

// Factories
import { makeMarket } from "@/test/factories/make-market";

// Repositories
import { InMemoryMarketsRepository } from "@/test/repositories/in-memory-markets-repository";

let marketsRepository: InMemoryMarketsRepository;
let sut: ListMarketsUseCase;

describe("list markets", () => {
  beforeEach(() => {
    marketsRepository = new InMemoryMarketsRepository();
    sut = new ListMarketsUseCase(marketsRepository);
  });

  it("should be able to list markets", async () => {
    const market1 = makeMarket({ name: "Mercado Central", open: true });
    const market2 = makeMarket({ name: "Mercado da Vila", open: false });
    const market3 = makeMarket({ name: "Feira Livre", open: true });

    marketsRepository.items.push(market1, market2, market3);

    const result = await sut.execute({
      page: 1,
    });

    expect(result.markets).toHaveLength(3);
    expect(result.markets).toEqual([
      expect.objectContaining({ name: "Mercado Central" }),
      expect.objectContaining({ name: "Mercado da Vila" }),
      expect.objectContaining({ name: "Feira Livre" }),
    ]);
  });

  it("should be able to list only open markets", async () => {
    const openMarket1 = makeMarket({ name: "Mercado Aberto 1", open: true });
    const openMarket2 = makeMarket({ name: "Mercado Aberto 2", open: true });
    const closedMarket = makeMarket({ name: "Mercado Fechado", open: false });

    marketsRepository.items.push(openMarket1, openMarket2, closedMarket);

    const result = await sut.execute({
      page: 1,
      open: true,
    });

    expect(result.markets).toHaveLength(2);
    expect(result.markets).toEqual([
      expect.objectContaining({ name: "Mercado Aberto 1", open: true }),
      expect.objectContaining({ name: "Mercado Aberto 2", open: true }),
    ]);
  });

  it("should be able to list only closed markets", async () => {
    const openMarket = makeMarket({ name: "Mercado Aberto", open: true });
    const closedMarket1 = makeMarket({ name: "Mercado Fechado 1", open: false });
    const closedMarket2 = makeMarket({ name: "Mercado Fechado 2", open: false });

    marketsRepository.items.push(openMarket, closedMarket1, closedMarket2);

    const result = await sut.execute({
      page: 1,
      open: false,
    });

    expect(result.markets).toHaveLength(2);
    expect(result.markets).toEqual([
      expect.objectContaining({ name: "Mercado Fechado 1", open: false }),
      expect.objectContaining({ name: "Mercado Fechado 2", open: false }),
    ]);
  });

  it("should be able to filter markets by name", async () => {
    const market1 = makeMarket({ name: "Mercado Central", open: true });
    const market2 = makeMarket({ name: "Mercado da Vila", open: true });
    const market3 = makeMarket({ name: "Feira Livre", open: true });

    marketsRepository.items.push(market1, market2, market3);

    const result = await sut.execute({
      page: 1,
      name: "Mercado",
    });

    expect(result.markets).toHaveLength(2);
    expect(result.markets).toEqual([
      expect.objectContaining({ name: "Mercado Central" }),
      expect.objectContaining({ name: "Mercado da Vila" }),
    ]);
  });

  it("should be able to filter markets by name and open status", async () => {
    const openMarket = makeMarket({ name: "Mercado Central", open: true });
    const closedMarket = makeMarket({ name: "Mercado da Vila", open: false });
    const fairMarket = makeMarket({ name: "Feira Livre", open: true });

    marketsRepository.items.push(openMarket, closedMarket, fairMarket);

    const result = await sut.execute({
      page: 1,
      name: "Mercado",
      open: true,
    });

    expect(result.markets).toHaveLength(1);
    expect(result.markets).toEqual([
      expect.objectContaining({ name: "Mercado Central", open: true }),
    ]);
  });

  it("should return empty array when no markets match filters", async () => {
    const market1 = makeMarket({ name: "Mercado Central", open: true });
    const market2 = makeMarket({ name: "Feira Livre", open: false });

    marketsRepository.items.push(market1, market2);

    const result = await sut.execute({
      page: 1,
      name: "Supermercado",
    });

    expect(result.markets).toHaveLength(0);
    expect(result.markets).toEqual([]);
  });

  it("should return empty array when no markets exist", async () => {
    const result = await sut.execute({
      page: 1,
    });

    expect(result.markets).toHaveLength(0);
    expect(result.markets).toEqual([]);
  });

  it("should handle pagination correctly", async () => {
    for (let i = 1; i <= 25; i++) {
      const market = makeMarket({ name: `Mercado ${i}`, open: true });
      marketsRepository.items.push(market);
    }

    const { markets } = await sut.execute({
      page: 2,
    });

    expect(markets).toHaveLength(5);
  });
});
