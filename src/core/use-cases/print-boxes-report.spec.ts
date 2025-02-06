// Repositories
import { InMemoryBoxesRepository } from "@/test/repositories/in-memory-boxes-repository";
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";

// Services
import { MockedPDFService } from "@/test/report/mocked-pdf-service";
import { makeBox } from "@/test/factories/make-box";
import { makeCycle } from "@/test/factories/make-cycle";

// Use-cases
import { PrintBoxesReportUseCase } from "@/core/use-cases/print-boxes-report";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { makeCatalog } from "@/test/factories/make-catalog";

let boxesRepository: InMemoryBoxesRepository;
let cyclesRepository: InMemoryCyclesRepository;

let pdfService: MockedPDFService;

let sut: PrintBoxesReportUseCase;

describe("print boxes report", () => {
  beforeEach(() => {
    cyclesRepository = new InMemoryCyclesRepository();
    boxesRepository = new InMemoryBoxesRepository();
    
    pdfService = new MockedPDFService();

    sut = new PrintBoxesReportUseCase(
      cyclesRepository,
      boxesRepository,
      pdfService
    );
  });

  it("should be able to print the cycle boxes report", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const catalog = makeCatalog({ cycle_id: cycle.id })

    const box = makeBox({ 
      catalog
    });
    boxesRepository.items.push(box);

    const { pdf } = await sut.execute({
      cycle_id: cycle.id.value,
    });

    expect(pdf).toBeInstanceOf(Buffer);
  });

  it("should not be able to print a report of the boxes of a cycle that does not exist", async () => {
    await expect(() =>
      sut.execute({
        cycle_id: "123",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
