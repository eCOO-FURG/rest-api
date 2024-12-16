// Repositories
import { InMemoryBagsRepository } from "@/test/repositories/in-memory-bags-repository";
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";

// Services
import { MockedPDFService } from "@/test/pdf/mocked-pdf-service";
import { makeBag } from "@/test/factories/make-bag";
import { makeCycle } from "@/test/factories/make-cycle";

// Use-cases
import { PrintDeliveryReportUseCase } from "@/core/use-cases/print-bags-report";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

let bagsRepository: InMemoryBagsRepository;
let cyclesRepository: InMemoryCyclesRepository;

let pdfService: MockedPDFService;

let sut: PrintDeliveryReportUseCase;

describe("print bags report", () => {
  beforeEach(() => {
    cyclesRepository = new InMemoryCyclesRepository();
    bagsRepository = new InMemoryBagsRepository();

    pdfService = new MockedPDFService();

    sut = new PrintDeliveryReportUseCase(
      cyclesRepository,
      bagsRepository,
      pdfService
    );
  });

  it("should be able to print the cycle bags report", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const bag = makeBag({ cycle_id: cycle.id });
    bagsRepository.items.push(bag);

    const { pdf } = await sut.execute({
      cycle_id: cycle.id.value,
      withdraw: false,
    });

    expect(pdf).toBeInstanceOf(Buffer);
  });

  it("should be able to print a report of the bags of a cycle that does not exists", async () => {
    await expect(() =>
      sut.execute({
        cycle_id: "none",
        withdraw: false,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
