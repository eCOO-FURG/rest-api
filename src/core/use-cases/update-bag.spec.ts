// Repositories
import { InMemoryBagsRepository } from "@/test/repositories/in-memory-bags-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Use-cases
import { UpdateBagUseCase } from "@/core/use-cases/update-bag";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceNotVerifiedError } from "@/core/errors/resource-not-verified";
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";

// Messages
import { MockedChat } from "@/test/message/mocked-chat";

// Factories
import { makeCycle } from "@/test/factories/make-cycle";
import { makeBag } from "@/test/factories/make-bag";
import { makeUser } from "@/test/factories/make-user";

let usersRepository: InMemoryUsersRepository;
let bagsRepository: InMemoryBagsRepository;
let cyclesRepository: InMemoryCyclesRepository;

let chat: MockedChat;

let sut: UpdateBagUseCase;

describe("update bag", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    bagsRepository = new InMemoryBagsRepository();
    cyclesRepository = new InMemoryCyclesRepository();
    chat = new MockedChat();

    sut = new UpdateBagUseCase(bagsRepository, usersRepository, cyclesRepository, chat);
  });

  it("should be able to update a bag", async () => {
    const user = makeUser();
    usersRepository.items.push(user);

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const bag = makeBag({
      status: "PENDING",
      cycle_id: cycle.id,
      customer_id: user.id,
      customer: user,
      verified: true,
    });

    await bagsRepository.create(bag);

    await sut.execute({
      bag_id: bag.id.value,
      status: "CANCELLED",
    });

    expect(bagsRepository.items[0].status).toEqual("CANCELLED");
  });

  it("should be able to send a message to the user", async () => {
    const user = makeUser({ chat: "code" });
    usersRepository.items.push(user);

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const bag = makeBag({
      status: "PENDING",
      cycle_id: cycle.id,
      customer_id: user.id,
      customer: user,
      verified: true,
    });

    await bagsRepository.create(bag);

    await sut.execute({
      bag_id: bag.id.value,
      status: "CANCELLED",
    });

    expect(chat.messages.length).toEqual(1);
  });

  it("should not be able to handle a bag that does not exist", async () => {
    await expect(
      sut.execute({
        bag_id: "invalid-id",
        status: "SEPARATED",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to update a bag that is not verified", async () => {
    const user = makeUser();
    usersRepository.items.push(user);

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const bag = makeBag({
      status: "PENDING",
      cycle_id: cycle.id,
      customer_id: user.id,
      customer: user,
    });

    await bagsRepository.create(bag);

    await expect(
      sut.execute({
        bag_id: bag.id.value,
        status: "SEPARATED",
      }),
    ).rejects.toBeInstanceOf(ResourceNotVerifiedError);
  });
});
