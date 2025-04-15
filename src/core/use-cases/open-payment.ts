// Entities
import { Payment } from "@/core/entities/payment";

// Repositories
import { BagsRepository } from "@/core/repositories/bags-repository";
import { PaymentsRepository } from "@/core/repositories/payments-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";
import { ResourceNotVerifiedError } from "@/core/errors/resource-not-verified";

// Services
import { PixProvider } from "@/core/payment/pix-provider";

interface OpenPaymentUseCaseRequest {
  bag_id: string;
}

export class OpenPaymentUseCase {
  constructor(
    private bagsRepository: BagsRepository,
    private paymentsRepository: PaymentsRepository,
    private pixProvider: PixProvider,
  ) {}

  async execute({ bag_id }: OpenPaymentUseCaseRequest) {
    const bag = await this.bagsRepository.find("bag-and-details", {
      id: bag_id,
    });

    if (!bag) throw new ResourceNotFoundError("Sacola", bag_id);

    if (!bag.verified) throw new ResourceNotVerifiedError("Sacola", bag_id);

    const previous = await this.paymentsRepository.find("payment", {
      bag_id: bag.id.value,
    });

    if (previous && previous.status === "DONE") throw new ResourceAlreadyExistsError("Pagamento da sacola", bag_id);

    const payment = Payment.create({
      method: "PIX",
      bag_id: bag.id,
      bag,
    });

    await this.paymentsRepository.create(payment);

    bag.payment = payment;

    const charge = await this.pixProvider.charge(bag);

    return { payment, charge };
  }
}
