// Repositories
import { InMemoryBagsRepository } from "@/test/repositories/in-memory-bags-repository";
import { InMemoryAddressesRepository } from "@/test/repositories/in-memory-addresses-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryCatalogsRepository } from "@/test/repositories/in-memory-catalogs-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";

// Use-cases
import { RegisterPaymentUseCase } from "@/core/use-cases/register-payment";

// Services
import { makeBag } from "@/test/factories/make-bag";
import { makeUser } from "@/test/factories/make-user";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";

let bagsRepository: InMemoryBagsRepository;

let sut: RegisterPaymentUseCase;

describe("Register payment", () => {
  beforeEach(() => {
    bagsRepository = new InMemoryBagsRepository();

    sut = new RegisterPaymentUseCase(bagsRepository);
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

    const bag = makeBag({ user_id: user.id, user });
    await bagsRepository.create(bag);

    await sut.execute({
      bag_id: bag.id.value,
      method: "CREDIT",
    });

    await expect(() =>
      sut.execute({
        bag_id: bag.id.value,
        method: "CREDIT",
      })
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });
});
