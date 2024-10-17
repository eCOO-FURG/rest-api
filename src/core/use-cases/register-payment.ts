// Entities
import { Payment } from "@/core/entities/payment";
import { UUID } from "@/core/entities/aggregates/uuid";

// Repositories
import { PaymentsRepository } from "@/core/repositories/payments-repository";
import { BagsRepository } from "@/core/repositories/bags-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";

interface RegisterPaymentUseCaseRequest {
  bag_id: string;
  method: "CREDIT" | "DEBIT" | "CASH" | "PIX";
  status: "PENDING" | "DONE" | "FAILED";
}

export class RegisterPaymentUseCase {
  constructor(
    private bagsRepository: BagsRepository,
    private paymentsRepository: PaymentsRepository
  ) {}

  async execute({ bag_id, method, status }: RegisterPaymentUseCaseRequest) {
    const bag = await this.bagsRepository.search({ id: bag_id }, "merged");

    if (!bag) throw new ResourceNotFoundError("Sacola", bag_id);

    const done = bag.paid();

    if (done)
      throw new ResourceAlreadyExistsError("Pagamento da sacola", bag_id);

    const payment = Payment.create({
      bag_id: new UUID(bag_id),
      method,
      status,
    });

    await this.paymentsRepository.create(payment);
  }
}
