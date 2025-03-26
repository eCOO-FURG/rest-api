// Repositories
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Use-cases
import { SendNotificationUseCase } from "@/core/use-cases/send-notification";

// Services
import { MockedMailer } from "@/test/mail/mocked-mailer";

// Factories
import { makeUser } from "@/test/factories/make-user";
import { makeFile } from "@/test/factories/make-file";

let usersRepository: InMemoryUsersRepository;
let mailer: MockedMailer;
let sut: SendNotificationUseCase;

describe("send notification", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    mailer = new MockedMailer();

    sut = new SendNotificationUseCase(usersRepository, mailer);
  });

  it("should be able to send notifications to users", async () => {
    const user1 = makeUser({ roles: ["USER"] });
    const user2 = makeUser({ roles: ["USER"] });

    await usersRepository.create(user1);
    await usersRepository.create(user2);

    await sut.execute({
      role: "USER",
      title: "Test notification",
      message: "This is a test message",
    });
  });

  it("should send notifications only to users with specified role", async () => {
    const user1 = makeUser({ roles: ["USER"] });
    const user2 = makeUser({ roles: ["PRODUCER"], email: "john@producer.com" });

    await usersRepository.create(user1);
    await usersRepository.create(user2);

    await sut.execute({
      role: "PRODUCER",
      title: "Producer notification",
      message: "This is a producer message",
    });

    expect(mailer.messages).toHaveLength(1);
    expect(mailer.messages[0].to).toBe("john@producer.com");
  });

  it("should be able to send notifications with attachments", async () => {
    const user1 = makeUser({ roles: ["USER"] });
    const user2 = makeUser({ roles: ["USER"] });

    await usersRepository.create(user1);
    await usersRepository.create(user2);

    await sut.execute({
      role: "USER",
      title: "Test notification with attachment",
      message: "This is a test message with attachment",
      files: [makeFile()],
    });

    expect(mailer.messages).toHaveLength(2);
  });
});
