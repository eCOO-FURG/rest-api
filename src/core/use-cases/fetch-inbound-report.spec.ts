// Repositories
import { InMemoryBoxesRepository } from "@/test/repositories/in-memory-boxes-repository";
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";

// Services
import { MockedPDFService } from "@/test/report/mocked-pdf-service";
import { makeBox } from "@/test/factories/make-box";
import { makeCycle } from "@/test/factories/make-cycle";
import { makeCatalog } from "@/test/factories/make-catalog";

// Use-cases
import { FetchInboundReportUseCase } from "./fetch-inbound-report";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

let boxesRepository: InMemoryBoxesRepository;
let cyclesRepository: InMemoryCyclesRepository;
let pdfService: MockedPDFService;

let sut: FetchInboundReportUseCase;

describe("Fetch inbound report", () => {
  beforeEach(() => {
    cyclesRepository = new InMemoryCyclesRepository();
    boxesRepository = new InMemoryBoxesRepository();
    
    pdfService = new MockedPDFService();

    sut = new FetchInboundReportUseCase(
      boxesRepository,
      cyclesRepository,
      pdfService
    );
  });
  it("should be able to fetch the cycle inbound report", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const catalog = makeCatalog({ cycle_id: cycle.id })

    const box = makeBox({ 
      catalog
    });
    boxesRepository.items.push(box);

    const { file } = await sut.execute({
      cycle_id: cycle.id.value,
    });

    expect(file.content).toBeInstanceOf(Buffer);
  });

  it("should not be able to print a report of the inbound of a cycle that does not exist", async () => {
    await expect(() =>
      sut.execute({
        cycle_id: "123",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});