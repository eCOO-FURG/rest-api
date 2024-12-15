// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Entities
import { Payment } from "@/core/entities/payment";
import { BagsRepository } from "@/core/repositories/bags-repository";

interface UpdatePaymentUseCaseRequest {
  payment_id: string;
  method?: Payment["method"];
  status?: Payment["status"];
  flag?: Payment["flag"];
}

export class UpdatePaymentUseCase {
  constructor(private bagsRepository: BagsRepository) {}

  async execute({
    payment_id,
    method,
    status,
    flag,
  }: UpdatePaymentUseCaseRequest) {
    const bag = await this.bagsRepository.find("merge", {
      payments: { id: payment_id },
    });

    if (!bag)
      throw new ResourceNotFoundError("Sacola com pagamento", payment_id);

    const payment = bag.payments.get(payment_id);

    if (!payment) throw new ResourceNotFoundError("Pagamento", payment_id);

    payment.method = method ?? payment.method;
    payment.status = status ?? payment.status;
    payment.flag = flag ?? payment.flag;

    bag.payments.set(payment_id, payment);

    await this.bagsRepository.update(bag);
  }
}
