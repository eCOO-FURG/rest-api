// Repositories
import { InMemoryBagsRepository } from "@/test/repositories/in-memory-bags-repository";
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository";
// Services
import { MockedPDFService } from "@/test/pdf/mocked-pdf-service";
import { makeBag } from "@/test/factories/make-bag";
import { makeCycle } from "@/test/factories/make-cycle";

// Use-cases
import { PrintDeliveriesReportUseCase } from "@/core/use-cases/print-deliveries-report";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

let productsRepository: InMemoryProductsRepository;
let usersRepository: InMemoryUsersRepository;
let offersRepository: InMemoryOffersRepository;
let ordersRepository: InMemoryOrdersRepository;

let repositories: {
  bags: InMemoryBagsRepository;
  cycles: InMemoryCyclesRepository;
};

let mocks: {
  pdf: MockedPDFService;
};

let sut: PrintDeliveriesReportUseCase;

describe("print deliveries report", () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    usersRepository = new InMemoryUsersRepository();
    offersRepository = new InMemoryOffersRepository(productsRepository);
    ordersRepository = new InMemoryOrdersRepository(offersRepository);

    repositories = {
      bags: new InMemoryBagsRepository(usersRepository, ordersRepository),
      cycles: new InMemoryCyclesRepository(),
    };

    mocks = {
      pdf: new MockedPDFService(),
    };

    sut = new PrintDeliveriesReportUseCase(
      repositories.cycles,
      repositories.bags,
      mocks.pdf
    );
  });

  it("should be able to print the cycle deliveries report", async () => {
    const cycle = makeCycle();
    repositories.cycles.items.push(cycle);

    const bag = makeBag({ cycle_id: cycle.id });
    await repositories.bags.create(bag);

    const { pdf } = await sut.execute({
      cycle_id: cycle.id.value,
    });

    expect(pdf).toBeInstanceOf(Buffer);
  });

  it("should be able to print the deliveries of a cycle that does not exists", async () => {
    await expect(() =>
      sut.execute({
        cycle_id: "none",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
