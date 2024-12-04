// Repositories
import { PaymentsRepository } from "@/core/repositories/payments-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Entities
import { Payment } from "@/core/entities/payment";

interface UpdatePaymentUseCaseRequest {
  payment_id: string;
  method?: Payment["method"];
  status?: Payment["status"];
  flag?: Payment["flag"];
}

export class UpdatePaymentUseCase {
  constructor(private paymentsRepository: PaymentsRepository) {}

  async execute({
    payment_id,
    method,
    status,
    flag,
  }: UpdatePaymentUseCaseRequest) {
    const payment = await this.paymentsRepository.find("basic", {
      id: payment_id,
    });

    if (!payment) throw new ResourceNotFoundError("Pagamento", payment_id);

    payment.method = method ?? payment.method;
    payment.status = status ?? payment.status;
    payment.flag = flag ?? payment.flag;

    await this.paymentsRepository.update(payment);
  }
}
