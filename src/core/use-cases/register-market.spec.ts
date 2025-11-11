// Use-cases
import { RegisterMarketUseCase } from "@/core/use-cases/register-market";

// Factories
import { makeMarket } from "@/test/factories/make-market";

// Repositories
import { InMemoryMarketsRepository } from "@/test/repositories/in-memory-markets-repository";

// Errors
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";

let marketsRepository: InMemoryMarketsRepository;
let sut: RegisterMarketUseCase;

describe("register market", () => {
  beforeEach(() => {
    marketsRepository = new InMemoryMarketsRepository();
    sut = new RegisterMarketUseCase(marketsRepository);
  });

  it("should be able to register a market", async () => {
    const result = await sut.execute({
      name: "Mercado Central",
      description: "Descrição do mercado",
    });

    expect(result.market).toBeDefined();
    expect(result.market.name).toBe("Mercado Central");
    expect(result.market.description).toBe("Descrição do mercado");
    expect(marketsRepository.items).toHaveLength(1);
    expect(marketsRepository.items[0]).toEqual(result.market);
  });

  it("should be able to register a market without description", async () => {
    const result = await sut.execute({
      name: "Feira Livre",
    });

    expect(result.market).toBeDefined();
    expect(result.market.name).toBe("Feira Livre");
    expect(result.market.description).toBeNull();
    expect(marketsRepository.items).toHaveLength(1);
  });

  it("should create market as open by default", async () => {
    const result = await sut.execute({
      name: "Mercado da Vila",
    });

    expect(result.market.open).toBe(true);
  });

  it("should set created_at when registering market", async () => {
    const result = await sut.execute({
      name: "Mercado Teste",
    });

    expect(result.market.created_at).toBeDefined();
    expect(result.market.created_at).toBeInstanceOf(Date);
  });

  it("should not be able to register a market when another market is already open", async () => {
    const openMarket = makeMarket({ open: true });
    marketsRepository.items.push(openMarket);

    await expect(() =>
      sut.execute({
        name: "Novo Mercado",
        description: "Tentativa de criar outro mercado",
      }),
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it("should be able to register a market when no market is open", async () => {
    const closedMarket1 = makeMarket({ open: false });
    const closedMarket2 = makeMarket({ open: false });
    marketsRepository.items.push(closedMarket1, closedMarket2);

    const result = await sut.execute({
      name: "Novo Mercado",
    });

    expect(result.market).toBeDefined();
    expect(marketsRepository.items).toHaveLength(3);
  });
});
