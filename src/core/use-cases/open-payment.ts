// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { Payment } from "@/core/entities/payment";

// Repositories
import { BagsRepository } from "@/core/repositories/bags-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";

// Services
import { PixProvider } from "@/core/payment/pix-provider";

interface OpenPaymentUseCaseRequest {
  bag_id: string;
}

export class OpenPaymentUseCase {
  constructor(
    private bagsRepository: BagsRepository,
    private pixProvider: PixProvider
  ) {}

  async execute({ bag_id }: OpenPaymentUseCaseRequest) {
    const bag = await this.bagsRepository.find("merge", { id: bag_id });

    if (!bag) throw new ResourceNotFoundError("Sacola", bag_id);

    if (bag.paid() || bag.open())
      throw new ResourceAlreadyExistsError("Pagamento da sacola", bag_id);

    const payment = Payment.create({
      method: "PIX",
      expires_at: new Date(Date.now() + 1000 * 60 * 15),
      bag_id: new UUID(bag_id),
      bag,
    });

    bag.payments.set(payment.id.value, payment);

    const charge = await this.pixProvider.charge(payment);

    payment.providerTransactionId = charge.providerTransactionId;

    await this.bagsRepository.update(bag);

    return { payment, charge };
  }
}
