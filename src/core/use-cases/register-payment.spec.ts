// Repositories
import { InMemoryBagsRepository } from "@/test/repositories/in-memory-bags-repository";
import { InMemoryPaymentsRepository } from "@/test/repositories/in-memory-payments-repository";

// Use-cases
import { RegisterPaymentUseCase } from "@/core/use-cases/register-payment";

// Services
import { makeBag } from "@/test/factories/make-bag";
import { makeUser } from "@/test/factories/make-user";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";
import { makePayment } from "@/test/factories/make-payment";

let bagsRepository: InMemoryBagsRepository;
let paymentsRepository: InMemoryPaymentsRepository;

let sut: RegisterPaymentUseCase;

describe("Register payment", () => {
  beforeEach(() => {
    bagsRepository = new InMemoryBagsRepository();
    paymentsRepository = new InMemoryPaymentsRepository();

    sut = new RegisterPaymentUseCase(bagsRepository, paymentsRepository);
  });

  it("should be able to register a payment", async () => {
    const user = makeUser();

    const bag = makeBag({ user_id: user.id, user });
    await bagsRepository.create(bag);

    await sut.execute({
      bag_id: bag.id.value,
      method: "CREDIT",
    });
  });

  it("should not be able to register a payment with a non-existent bag", async () => {
    await expect(() =>
      sut.execute({
        bag_id: "non-existent-bag-id",
        method: "CREDIT",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to register a payment with a bag that is already paid", async () => {
    const user = makeUser();

    const bag = makeBag({ user_id: user.id, user, paid: true });
    await bagsRepository.create(bag);

    const payment = makePayment({ bag_id: bag.id, status: "DONE" });
    await paymentsRepository.create(payment);

    bag.payments.push(payment);

    await expect(() =>
      sut.execute({
        bag_id: bag.id.value,
        method: "CREDIT",
      })
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });
});
