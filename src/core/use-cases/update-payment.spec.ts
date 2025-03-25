// Use-cases
import { UpdatePaymentUseCase } from "@/core/use-cases/update-payment";
import { makePayment } from "@/test/factories/make-payment";

// Repositories
import { InMemoryBagsRepository } from "@/test/repositories/in-memory-bags-repository";
import { InMemoryPaymentsRepository } from "@/test/repositories/in-memory-payments-repository";

// Factories
import { makeBag } from "@/test/factories/make-bag";

// Payments
import { MockedPixProvider } from "@/test/payment/mocked-pix-provider";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

let bagsRepository: InMemoryBagsRepository;
let paymentsRepository: InMemoryPaymentsRepository;
let pixProvider: MockedPixProvider;

let sut: UpdatePaymentUseCase;

describe("Update payment", () => {
  beforeEach(() => {
    bagsRepository = new InMemoryBagsRepository();
    paymentsRepository = new InMemoryPaymentsRepository();
    pixProvider = new MockedPixProvider();
    sut = new UpdatePaymentUseCase(paymentsRepository, pixProvider);
  });

  it("should be able to update a payment", async () => {
    const bag = makeBag();

    const payment = makePayment();
    await paymentsRepository.create(payment);

    await bagsRepository.create(bag);

    await sut.execute({ payment_id: payment.id.value, status: "DONE" });

    expect(paymentsRepository.items[0].status).toBe("DONE");
  });

  it("should not be able to update a non-existent payment", async () => {
    await expect(() =>
      sut.execute({ payment_id: "non-existent-payment-id", status: "DONE" })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
