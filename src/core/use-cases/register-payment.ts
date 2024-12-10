// Entities
import { Payment } from "@/core/entities/payment";
import { UUID } from "@/core/entities/aggregates/uuid";

// Repositories
import { BagsRepository } from "@/core/repositories/bags-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";

interface RegisterPaymentUseCaseRequest {
  bag_id: string;
  method: "CREDIT" | "DEBIT" | "CASH" | "PIX";
  flag?: "MASTERCARD" | "VISA" | "OTHER";
}

export class RegisterPaymentUseCase {
  constructor(private bagsRepository: BagsRepository) {}

  async execute({ bag_id, method, flag }: RegisterPaymentUseCaseRequest) {
    const bag = await this.bagsRepository.find("merge", {
      id: bag_id,
    });

    if (!bag) throw new ResourceNotFoundError("Sacola", bag_id);

    const done = bag.paid();

    if (done)
      throw new ResourceAlreadyExistsError("Pagamento da sacola", bag_id);

    const payment = Payment.create({
      bag_id: new UUID(bag_id),
      status: "DONE",
      method,
      flag,
    });

    bag.payments.set(payment.id.value, payment);

    await this.bagsRepository.update(bag);
  }
}
