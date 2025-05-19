// Repositories
import { InMemoryBagsRepository } from "@/test/repositories/in-memory-bags-repository";
import { InMemoryPaymentsRepository } from "@/test/repositories/in-memory-payments-repository";

// Use-cases
import { RegisterPaymentUseCase } from "@/core/use-cases/register-payment";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";
import { ResourceNotVerifiedError } from "@/core/errors/resource-not-verified";

// Factories
import { makePayment } from "@/test/factories/make-payment";
import { makeBag } from "@/test/factories/make-bag";
import { makeUser } from "@/test/factories/make-user";

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

    const bag = makeBag({
      customer_id: user.id,
      customer: user,
      status: "MOUNTED",
    });
    await bagsRepository.create(bag);

    await sut.execute({
      bag_id: bag.id.value,
      method: "CREDIT",
    });
  });

  it("should not be able to register a payment for a non verified bag", async () => {
    const user = makeUser();

    const bag = makeBag({ customer_id: user.id, customer: user });
    await bagsRepository.create(bag);

    await expect(() =>
      sut.execute({
        bag_id: bag.id.value,
        method: "CREDIT",
      }),
    ).rejects.toBeInstanceOf(ResourceNotVerifiedError);
  });

  it("should not be able to register a payment for a non-existent bag", async () => {
    await expect(() =>
      sut.execute({
        bag_id: "non-existent-bag-id",
        method: "CREDIT",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to register a payment for a bag that is already paid", async () => {
    const user = makeUser();

    const bag = makeBag({
      customer_id: user.id,
      customer: user,
      status: "MOUNTED",
    });
    await bagsRepository.create(bag);

    const payment = makePayment({ bag_id: bag.id, status: "DONE" });
    await paymentsRepository.create(payment);

    await expect(() =>
      sut.execute({
        bag_id: bag.id.value,
        method: "CREDIT",
      }),
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });
});
