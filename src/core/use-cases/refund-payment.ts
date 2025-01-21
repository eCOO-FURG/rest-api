// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Services
import { PixProvider } from "@/core/payment/pix-provider";

// Repositories
import { BagsRepository } from "@/core/repositories/bags-repository";

interface RefundPaymentUseCaseRequest {
  bag_id: string
}

export class RefundPaymentUseCase {
  constructor(
    private bagsRepository: BagsRepository,
    private pixProvider: PixProvider
  ) { }

  async execute({ bag_id }: RefundPaymentUseCaseRequest) {
    const bag = await this.bagsRepository.find("merge", { id: bag_id })

    if (!bag) throw new ResourceNotFoundError("Sacola", bag_id);

    const payment = Array.from(bag.payments.values()).find(
      (payment) => payment.status === "DONE"
    );

    if (!payment)
      throw new ResourceNotFoundError("Nenhum pagamento concluído foi encontrado para a sacola", bag_id);

    const refund = await this.pixProvider.refund({
      bag,
      payment_id: payment.id.value,
    });

    payment.refund();

    await this.bagsRepository.update(bag);

    return { payment, refund };
  }
}