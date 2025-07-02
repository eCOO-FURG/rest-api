// Repositories
import { InMemoryCatalogsRepository } from "@/test/repositories/in-memory-catalogs-repository";
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";

// Services
import { MockedPDFService } from "@/test/report/mocked-pdf-service";

// Factories
import { makeCycle } from "@/test/factories/make-cycle";
import { makeCatalog } from "@/test/factories/make-catalog";
import { makeCatalogAndOffers } from "@/test/factories/make-catalog-and-offers";

// Use-cases
import { FetchOffersReportUseCase } from "./fetch-offers-report";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { MockedSpreadsheetService } from "@/test/report/mocked-spreadsheet-service";

let catalogsRepository: InMemoryCatalogsRepository;
let cyclesRepository: InMemoryCyclesRepository;
let pdfService: MockedPDFService;
let spreadsheetService: MockedSpreadsheetService;

let sut: FetchOffersReportUseCase;

describe("Fetch offers report", () => {
  beforeEach(() => {
    catalogsRepository = new InMemoryCatalogsRepository();
    cyclesRepository = new InMemoryCyclesRepository();
    pdfService = new MockedPDFService();
    spreadsheetService = new MockedSpreadsheetService();

    sut = new FetchOffersReportUseCase(cyclesRepository, catalogsRepository, pdfService, spreadsheetService);
  });

  it("should be able to fetch the offers report from a cycle", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const catalog = makeCatalog({ cycle_id: cycle.id });
    const catalogAndOffers = makeCatalogAndOffers(catalog);

    catalogsRepository.items.push(catalogAndOffers);

    const { file } = await sut.execute({
      cycle_id: cycle.id.value,
      type: "pdf",
    });

    expect(file.content).toBeInstanceOf(Buffer);
  });

  it("should not be able to fetch offers report from a non-existent cycle", async () => {
    await expect(() =>
      sut.execute({
        cycle_id: "non-existent-cycle-id",
        type: "pdf",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should be able to fetch the offers report from a cycle as spreadsheet", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const catalog = makeCatalog({ cycle_id: cycle.id });
    const catalogAndOffers = makeCatalogAndOffers(catalog);

    catalogsRepository.items.push(catalogAndOffers);

    const { file } = await sut.execute({
      cycle_id: cycle.id.value,
      type: "spreadsheet",
    });

    expect(file.content).toBeInstanceOf(Buffer);
    expect(file.mimetype).toBe("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    expect(file.name).toMatch(/\.xlsx$/);
  });
});
