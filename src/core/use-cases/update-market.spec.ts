// Use-cases
import { UpdateMarketUseCase } from "@/core/use-cases/update-market";

// Factories
import { makeMarket } from "@/test/factories/make-market";

// Repositories
import { InMemoryMarketsRepository } from "@/test/repositories/in-memory-markets-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";

let marketsRepository: InMemoryMarketsRepository;
let sut: UpdateMarketUseCase;

describe("update market", () => {
  beforeEach(() => {
    marketsRepository = new InMemoryMarketsRepository();
    sut = new UpdateMarketUseCase(marketsRepository);
  });

  it("should be able to update a market name", async () => {
    const market = makeMarket({ name: "Mercado Central", open: false });
    marketsRepository.items.push(market);

    await sut.execute({
      market_id: market.id.value,
      name: "Novo Mercado Central",
    });

    expect(marketsRepository.items[0].name).toBe("Novo Mercado Central");
  });

  it("should be able to update a market description", async () => {
    const market = makeMarket({
      description: "Descrição antiga",
      open: false,
    });
    marketsRepository.items.push(market);

    await sut.execute({
      market_id: market.id.value,
      description: "Nova descrição do mercado",
    });

    expect(marketsRepository.items[0].description).toBe("Nova descrição do mercado");
  });

  it("should be able to set description to null", async () => {
    const market = makeMarket({
      description: "Descrição existente",
      open: false,
    });
    marketsRepository.items.push(market);

    await sut.execute({
      market_id: market.id.value,
      description: null,
    });

    expect(marketsRepository.items[0].description).toBeNull();
  });

  it("should be able to open a market when no other market is open", async () => {
    const market = makeMarket({ open: false });
    marketsRepository.items.push(market);

    await sut.execute({
      market_id: market.id.value,
      open: true,
    });

    expect(marketsRepository.items[0].open).toBe(true);
  });

  it("should be able to close a market", async () => {
    const market = makeMarket({ open: true });
    marketsRepository.items.push(market);

    await sut.execute({
      market_id: market.id.value,
      open: false,
    });

    expect(marketsRepository.items[0].open).toBe(false);
  });

  it("should be able to update multiple fields at once", async () => {
    const market = makeMarket({
      name: "Nome antigo",
      description: "Descrição antiga",
      open: false,
    });
    marketsRepository.items.push(market);

    await sut.execute({
      market_id: market.id.value,
      name: "Novo nome",
      description: "Nova descrição",
      open: true,
    });

    expect(marketsRepository.items[0]).toEqual(
      expect.objectContaining({
        name: "Novo nome",
        description: "Nova descrição",
        open: true,
      }),
    );
  });

  it("should call touch method when updating", async () => {
    const market = makeMarket({ open: false });
    const touchSpy = vi.spyOn(market, "touch");
    marketsRepository.items.push(market);

    await sut.execute({
      market_id: market.id.value,
      name: "Novo nome",
    });

    expect(touchSpy).toHaveBeenCalledOnce();
  });

  it("should not be able to update a nonexistent market", async () => {
    await expect(() =>
      sut.execute({
        market_id: "nonexistent-market-id",
        name: "Novo nome",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to open a market when another market is already open", async () => {
    const openMarket = makeMarket({ name: "Mercado Aberto", open: true });
    const closedMarket = makeMarket({ name: "Mercado Fechado", open: false });

    marketsRepository.items.push(openMarket, closedMarket);

    await expect(() =>
      sut.execute({
        market_id: closedMarket.id.value,
        open: true,
      }),
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it("should preserve existing values when not updating them", async () => {
    const market = makeMarket({
      name: "Nome original",
      description: "Descrição original",
      open: false,
    });
    marketsRepository.items.push(market);

    await sut.execute({
      market_id: market.id.value,
      name: "Novo nome",
      // Não passando description nem open
    });

    expect(marketsRepository.items[0]).toEqual(
      expect.objectContaining({
        name: "Novo nome",
        description: "Descrição original",
        open: false,
      }),
    );
  });
});
