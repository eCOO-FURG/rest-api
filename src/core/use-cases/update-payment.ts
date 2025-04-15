// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";

// Entities
import { Payment } from "@/core/entities/payment";

// Repositories
import { PaymentsRepository } from "@/core/repositories/payments-repository";

// Services
import { PixProvider } from "@/core/payment/pix-provider";

interface UpdatePaymentUseCaseRequest {
  payment_id: string;
  method?: Payment["method"];
  status?: Payment["status"];
  flag?: Payment["flag"];
}

export class UpdatePaymentUseCase {
  constructor(
    private paymentsRepository: PaymentsRepository,
    private pixProvider: PixProvider,
  ) {}

  async execute({ payment_id, method, status, flag }: UpdatePaymentUseCaseRequest) {
    const payment = await this.paymentsRepository.find("payment", {
      id: payment_id,
    });

    if (!payment) throw new ResourceNotFoundError("Pagamento", payment_id);

    if (payment.status === "REFUNDED") throw new ResourceAlreadyExistsError("Reembolso", payment_id);

    if (status === "REFUNDED") await this.pixProvider.refund(payment);

    payment.method = method ?? payment.method;
    payment.method = method ?? payment.method;
    payment.status = status ?? payment.status;
    payment.flag = flag ?? payment.flag;
    payment.touch();

    await this.paymentsRepository.update(payment);
  }
}
