// Repositories
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Use-cases
import { SendNotificationUseCase } from "./send-notification";

// Services
import { MockedMailer } from "@/test/mail/mocked-mailer";

// Factories
import { makeUser } from "@/test/factories/make-user";

// Libs
import { Buffer } from 'buffer';

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

    expect(mailer.emails).toHaveLength(1);
    expect(mailer.emails[0].to).toBe("john@producer.com");
  });

  it("should be able to send notifications with attachments", async () => {
    const user1 = makeUser({ roles: ["USER"] });
    const user2 = makeUser({ roles: ["USER"] });
  
    await usersRepository.create(user1);
    await usersRepository.create(user2);
  
    const pngBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
      0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52,
      0x00, 0x00, 0x00, 0x01,
      0x00, 0x00, 0x00, 0x01,
      0x08,
      0x06,
      0x00,
      0x00,
      0x00
    ]);

    const mockAttachment = {
      filename: "test.png",
      content: pngBuffer,
    };
  
    await sut.execute({
      role: "USER",
      title: "Test notification with attachment",
      message: "This is a test message with attachment",
      attachments: [mockAttachment],
    });
  
    expect(mailer.emails).toHaveLength(2);
  
    mailer.emails.forEach(email => {
      expect(email.attachments).toBeDefined();
      if (email.attachments) {
        expect(email.attachments).toHaveLength(1);
        expect(email.attachments[0].filename).toBe("test.png");
        expect(email.attachments[0].contentType).toBe("image/png");
      }
    });
  });
});
