// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { Payment } from "@/core/entities/payment";
import { PaymentAggregate } from "@/core/entities/aggregates/payment-aggregate";

// Repositories
import { BagsRepository } from "@/core/repositories/bags-repository";

import { PaymentsRepository } from "@/core/repositories/payments-repository";

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
    private paymentsRepository: PaymentsRepository,
    private pixProvider: PixProvider
  ) {}

  async execute({ bag_id }: OpenPaymentUseCaseRequest) {
    const bag = await this.bagsRepository.search({ id: bag_id }, "merged");

    if (!bag) throw new ResourceNotFoundError("Sacola", bag_id);

    if (bag.paid() || bag.open())
      throw new ResourceAlreadyExistsError("Pagamento da sacola", bag_id);

    const payment = Payment.create({ bag_id: new UUID(bag_id), method: "PIX" });

    await this.paymentsRepository.create(payment);

    const agrregate = PaymentAggregate.create({ ...payment.props, bag });

    await this.pixProvider.charge(agrregate);

    return { payment };
  }
}
