// Use-cases
import { ReportBagsUseCase } from "@/core/use-cases/report-bags";

// Services
import { MockedExcelService } from "@/test/service/mocked-excel";

// Repositories
import { InMemoryBagsRepository } from "@/test/repositories/in-memory-bags-repository";

// Mappers
import { makeBag } from "@/test/factories/make-bag";

// Utils
import { waitFor } from "@/test/utils/wait-for";

let repositories: {
  bags: InMemoryBagsRepository;
};

let mocks: {
  excelService: MockedExcelService;
};

let sut: ReportBagsUseCase;

describe("Report Bags UseCase", () => {
  beforeEach(() => {
    repositories = {
      bags: new InMemoryBagsRepository(),
    };

    mocks = {
      excelService: new MockedExcelService(),
    };

    sut = new ReportBagsUseCase(repositories.bags, mocks.excelService);

    vi.spyOn(mocks.excelService, "generateReport");
  });

  it("should generate a bags report", async () => {
    const bag1 = makeBag({
      code: "GREMIO",
      price: 100,
      created_at: new Date("2024-06-01"),
    });

    const bag2 = makeBag({
      code: "GREMIO2",
      price: 200,
      created_at: new Date("2024-06-10"),
    });

    repositories.bags.items.push(bag1, bag2);

    await sut.execute({
      since: new Date("2024-06-01"),
      before: new Date("2024-06-30"),
    });

    await waitFor(() => {
      expect(mocks.excelService.generateReport).toHaveBeenCalledWith(
        expect.any(Array),
        expect.any(Array),
        "Relatório de Sacolas"
      );
    });
  });

  it("should generate an empty bags report if no bags exist", async () => {
    await sut.execute({
      since: new Date("2024-06-01"),
      before: new Date("2024-06-30"),
    });

    await waitFor(() => {
      expect(mocks.excelService.generateReport).toHaveBeenCalledWith(
        [],
        expect.any(Array),
        "Relatório de Sacolas"
      );
    });
  });
});
