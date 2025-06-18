// Use-cases
import { ListAvailableOffersUseCase } from "@/core/use-cases/list-available-offers";

// Repositories
import { InMemoryCategoriesRepository } from "@/test/repositories/in-memory-categories-repository";
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";

// Services

// Errors

let sut: ListAvailableOffersUseCase;

let cyclesRepository: InMemoryCyclesRepository;
let offersRepository: InMemoryOffersRepository;
let categoriesRepository: InMemoryCategoriesRepository;

describe("list offers", () => {
  beforeEach(() => {
    cyclesRepository = new InMemoryCyclesRepository();
    offersRepository = new InMemoryOffersRepository();
    categoriesRepository = new InMemoryCategoriesRepository();

    sut = new ListAvailableOffersUseCase(offersRepository, cyclesRepository, categoriesRepository);
  });

  it("should be able to list available offers", async () => {});

  it("should not be able to list offers that are not available", async () => {});

  it("should not be able to list offers that are not active", async () => {});

  it("should be able to list available offers from a specific cycle", async () => {});

  it("should not be able to list available offers from a non-existing cycle", async () => {});

  it("should be able to list available offers from a specific category", async () => {});

  it("should not be able to list available offers from a non-existing category", async () => {});

  it("should be able to list available offers from a specific product", async () => {});

  it("should not be able to list available offers from a non-existing product", async () => {});

  it("should be able to list offers with pagination", async () => {});

  it("should return an empty array if no offers match the criteria", async () => {});
});
