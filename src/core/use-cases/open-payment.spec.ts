// Use-cases
import { OpenPaymentUseCase } from "@/core/use-cases/open-payment";

// Providers
// Repositories
import { InMemoryBagsRepository } from "@/test/repositories/in-memory-bags-repository";

// Services
import { MockedPixProvider } from "@/test/payment/mocked-pix-provider";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";

// Factories
import { makeUser } from "@/test/factories/make-user";
import { makeBag } from "@/test/factories/make-bag";
import { makePayment } from "@/test/factories/make-payment";

let bagsRepository: InMemoryBagsRepository;

let pixProvider: MockedPixProvider;

let sut: OpenPaymentUseCase;

describe("open payment", () => {
  beforeEach(() => {
    bagsRepository = new InMemoryBagsRepository();
    pixProvider = new MockedPixProvider();

    sut = new OpenPaymentUseCase(bagsRepository, pixProvider);
  });

  it("be able to open a payment", async () => {
    const user = makeUser();

    const bag = makeBag({ user_id: user.id, user });
    bagsRepository.items.push(bag);

    await sut.execute({ bag_id: bag.id.value });

    expect(bagsRepository.items[0].open()).toBeTruthy();
  });

  it("should not be able to open a payment from a non existing bag", async () => {
    await expect(() => sut.execute({ bag_id: "1234" })).rejects.toBeInstanceOf(
      ResourceNotFoundError
    );
  });

  it("should not be able to open a payment from a paid bag", async () => {
    const user = makeUser();

    const bag = makeBag({ user_id: user.id });

    const payment = makePayment({ bag_id: bag.id, status: "DONE" });

    bag.payments.set(payment.id.value, payment);

    bagsRepository.items.push(bag);

    await expect(() =>
      sut.execute({ bag_id: bag.id.value })
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it("should not be able to open a payment for a bag with an open payment", async () => {
    const user = makeUser();

    const bag = makeBag({ user_id: user.id, user });

    const payment = makePayment({ bag_id: bag.id, status: "PENDING" });

    bag.payments.set(payment.id.value, payment);

    bagsRepository.items.push(bag);

    await expect(() =>
      sut.execute({ bag_id: bag.id.value })
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });
});
