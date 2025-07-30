// Repositories
import { InMemoryBagsRepository } from "@/test/repositories/in-memory-bags-repository";
import { InMemoryCatalogsRepository } from "@/test/repositories/in-memory-catalogs-repository";
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";

// Services
import { makeBag } from "@/test/factories/make-bag";
import { makeCycle } from "@/test/factories/make-cycle";
import { MockedPDFService } from "@/test/report/mocked-pdf-service";

// Use-cases
import { FetchSalesReportUseCase } from "@/core/use-cases/fetch-sales-report";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { MockedSpreadsheetService } from "@/test/report/mocked-spreadsheet-service";

let bagsRepository: InMemoryBagsRepository;
let catalogsRepository: InMemoryCatalogsRepository;
let cyclesRepository: InMemoryCyclesRepository;

let pdfService: MockedPDFService;
let spreadsheetService: MockedSpreadsheetService;

let sut: FetchSalesReportUseCase;

describe("print bags report", () => {
  beforeEach(() => {
    cyclesRepository = new InMemoryCyclesRepository();
    bagsRepository = new InMemoryBagsRepository();
    catalogsRepository = new InMemoryCatalogsRepository();

    pdfService = new MockedPDFService();
    spreadsheetService = new MockedSpreadsheetService();

    sut = new FetchSalesReportUseCase(
      cyclesRepository,
      bagsRepository,
      catalogsRepository,
      pdfService,
      spreadsheetService,
    );
  });

  it("should be able to print the cycle bags report", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const bag = makeBag({ cycle_id: cycle.id });
    bagsRepository.items.push(bag);

    const { file } = await sut.execute({
      cycle_id: cycle.id.value,
      withdraw: false,
      type: "pdf",
    });

    expect(typeof file.name).toBe("string");
    expect(file.content instanceof Buffer).toBe(true);
    expect(Buffer.isBuffer(file.content)).toBe(true);
  });

  it("should be able to print a report of the bags of a cycle that does not exists", async () => {
    await expect(() =>
      sut.execute({
        cycle_id: "none",
        withdraw: false,
        type: "pdf",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
