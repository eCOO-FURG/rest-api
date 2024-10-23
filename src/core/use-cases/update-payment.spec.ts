// Repositories
import { InMemoryPaymentsRepository } from "@/test/repositories/in-memory-payments-repository";

// Use-cases
import { UpdatePaymentUseCase } from "@/core/use-cases/update-payment";
import { makePayment } from "@/test/factories/make-payment";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

let paymentsRepository: InMemoryPaymentsRepository;
let sut: UpdatePaymentUseCase;

describe("Update payment", () => {
  beforeEach(() => {
    paymentsRepository = new InMemoryPaymentsRepository();

    sut = new UpdatePaymentUseCase(paymentsRepository);
  });

  it("should be able to update a payment", async () => {
    const payment = makePayment();
    await paymentsRepository.create(payment);

    await sut.execute({ payment_id: payment.id.value, status: "DONE" });

    expect(paymentsRepository.items[0].status).toBe("DONE");
  });

  it("should not be able to update a non-existent payment", async () => {
    await expect(() =>
      sut.execute({ payment_id: "non-existent-payment-id", status: "DONE" })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
