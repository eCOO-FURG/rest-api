// Entities
import { Payment } from "@/core/entities/payment";
import { UUID } from "@/core/entities/aggregates/uuid";

// Repositories
import { BagsRepository } from "@/core/repositories/bags-repository";
import { PaymentsRepository } from "@/core/repositories/payments-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";
import { ResourceNotVerifiedError } from "@/core/errors/resource-not-verified";
import { ResourceClosedError } from "@/core/errors/resource-closed";
interface RegisterPaymentUseCaseRequest {
  bag_id: string;
  method: "CREDIT" | "DEBIT" | "CASH" | "PIX";
  flag?: "MASTERCARD" | "VISA" | "OTHER";
}

export class RegisterPaymentUseCase {
  constructor(
    private bagsRepository: BagsRepository,
    private paymentsRepository: PaymentsRepository,
  ) {}

  async execute({ bag_id, method, flag }: RegisterPaymentUseCaseRequest) {
    const bag = await this.bagsRepository.find("bag", {
      id: bag_id,
    });

    if (!bag) throw new ResourceNotFoundError("Sacola", bag_id);

    if (bag.status === "PENDING") throw new ResourceNotVerifiedError("Sacola", bag_id);

    if (bag.status === "CANCELLED") throw new ResourceClosedError("Sacola", bag_id);

    const previous = await this.paymentsRepository.find("payment", {
      bag_id: bag.id.value,
    });

    if (previous && previous.status === "DONE") throw new ResourceAlreadyExistsError("Pagamento da sacola", bag_id);

    const payment = Payment.create({
      bag_id: new UUID(bag_id),
      status: "DONE",
      method,
      flag,
    });

    await this.paymentsRepository.create(payment);
  }
}
