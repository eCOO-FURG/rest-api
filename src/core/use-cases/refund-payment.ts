import { ResourceNotFoundError } from "../errors/resource-not-found";
import { PixProvider } from "../payment/pix-provider";
import { BagsRepository } from "../repositories/bags-repository";

interface RefundPaymentUseCaseRequest {
  bag_id: string
}

export class RefundPaymentUseCase {
  constructor(
    private bagsRepository: BagsRepository,
    private pixProvider: PixProvider
  ){}

  async execute({ bag_id }: RefundPaymentUseCaseRequest) {
    const bag = await this.bagsRepository.find("merge", { id: bag_id })

    if (!bag) throw new ResourceNotFoundError("Sacola", bag_id);

    const payment = Array.from(bag.payments.values()).find(
      (payment) => payment.status === "DONE"
    );

    if (!payment) throw new ResourceNotFoundError("Pagamento", bag_id);

    if (!payment.providerTransactionId) {

    }

    const refund = await this.pixProvider.refund(payment);

    payment.status = "REFUNDED";

    await this.bagsRepository.update(bag);

    return { payment, refund };
  }
}