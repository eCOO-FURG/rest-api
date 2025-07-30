// Use-cases
import { OpenPaymentUseCase } from "@/core/use-cases/open-payment";

// Providers
// Repositories
import { InMemoryBagsRepository } from "@/test/repositories/in-memory-bags-repository";
import { InMemoryPaymentsRepository } from "@/test/repositories/in-memory-payments-repository";

// Services
import { MockedPixProvider } from "@/test/payment/mocked-pix-provider";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";
import { ResourceNotVerifiedError } from "@/core/errors/resource-not-verified";

// Factories
import { makeUser } from "@/test/factories/make-user";
import { makeBag } from "@/test/factories/make-bag";
import { makePayment } from "@/test/factories/make-payment";
let bagsRepository: InMemoryBagsRepository;
let paymentsRepository: InMemoryPaymentsRepository;

let pixProvider: MockedPixProvider;

let sut: OpenPaymentUseCase;

describe("open payment", () => {
  beforeEach(() => {
    bagsRepository = new InMemoryBagsRepository();
    pixProvider = new MockedPixProvider();
    paymentsRepository = new InMemoryPaymentsRepository();

    sut = new OpenPaymentUseCase(
      bagsRepository,
      paymentsRepository,
      pixProvider,
    );
  });

  it("be able to open a payment", async () => {
    const user = makeUser();

    const bag = makeBag({
      customer_id: user.id,
      customer: user,
      status: "MOUNTED",
    });
    bagsRepository.items.push(bag);

    await sut.execute({ bag_id: bag.id.value });

    expect(paymentsRepository.items[0].status).toBe("PENDING");
  });

  it("should not be able to open a payment from a non verified bag", async () => {
    const user = makeUser();

    const bag = makeBag({ customer_id: user.id, customer: user });

    bagsRepository.items.push(bag);

    await expect(() =>
      sut.execute({ bag_id: bag.id.value }),
    ).rejects.toBeInstanceOf(ResourceNotVerifiedError);
  });

  it("should not be able to open a payment from a non existing bag", async () => {
    await expect(() => sut.execute({ bag_id: "1234" })).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    );
  });

  it("should not be able to open a payment from a paid bag", async () => {
    const user = makeUser();

    const bag = makeBag({
      customer_id: user.id,
      customer: user,
      status: "MOUNTED",
    });

    bagsRepository.items.push(bag);

    const payment = makePayment({ bag_id: bag.id, bag, status: "DONE" });
    paymentsRepository.items.push(payment);

    await expect(() =>
      sut.execute({ bag_id: bag.id.value }),
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });
});
