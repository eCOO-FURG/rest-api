// Use-cases
import { RefundPaymentUseCase } from "@/core/use-cases/refund-payment";

// Providers
import { MockedPixProvider } from "@/test/payment/mocked-pix-provider";

// Repositories
import { InMemoryBagsRepository } from "@/test/repositories/in-memory-bags-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { PaymentNotFound } from "@/core/errors/payment-not-found";

// Factories
import { makeUser } from "@/test/factories/make-user";
import { makeBag } from "@/test/factories/make-bag";
import { makePayment } from "@/test/factories/make-payment";

let bagsRepository: InMemoryBagsRepository;
let pixProvider: MockedPixProvider;
let sut: RefundPaymentUseCase;

describe("Refund Payment", () => {
  beforeEach(() => {
    bagsRepository = new InMemoryBagsRepository();
    pixProvider = new MockedPixProvider();
    sut = new RefundPaymentUseCase(bagsRepository, pixProvider);
  });

  it("should be able to refund a payment", async () => {
    const user = makeUser();
    const bag = makeBag({ user_id: user.id, user });
    
    const payment = makePayment({
      bag_id: bag.id,
      status: "DONE",
      bag,
    });

    bag.payments.set(payment.id.value, payment);
    bagsRepository.items.push(bag);

    const { refund, payment: updatedPayment } = await sut.execute({ bag_id: bag.id.value });

    expect(updatedPayment.status).toBe("REFUNDED");
    expect(refund.status).toBe("CONFIRMED");
    expect(refund.value).toBe(bag.price);
    expect(refund.correlationID).toBe(payment.id.value);
    expect(refund.endToEndId).toBeDefined();
    expect(refund.time).toBeDefined();
    expect(refund.comment).toBe("Pagamento estornado com sucesso");
  });

  it("should not be able to refund a payment for a non-existing bag", async () => {
    await expect(() =>
      sut.execute({ bag_id: "non-existing-bag-id" })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to refund a payment if no 'DONE' payment exists", async () => {
    const user = makeUser();
    const bag = makeBag({ user_id: user.id, user });
    const payment = makePayment({
      bag_id: bag.id,
      status: "PENDING",
      bag,
    });

    bag.payments.set(payment.id.value, payment);
    bagsRepository.items.push(bag);

    await expect(() =>
      sut.execute({ bag_id: bag.id.value })
    ).rejects.toBeInstanceOf(PaymentNotFound);
  });
});