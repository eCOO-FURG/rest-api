// Entities
import { Payment } from "@/core/entities/payment";
// Payments
import { PixProvider } from "@/core/payment/pix-provider";

// Libs
import { createClient } from "@woovi/node-sdk";

// Env
import { env } from "@/infra/env";

type Client = ReturnType<typeof createClient>;

export class OpenPix implements PixProvider {
  private client: Client;

  constructor() {
    this.client = createClient({ appId: env.PIX_PROVIDER_API_KEY });
  }

  async charge(payment: Payment) {
    const name = `${payment.bag!.user!.first_name} ${
      payment.bag!.user!.last_name
    }`;

    const { charge } = await this.client.charge.create({
      correlationID: payment.id.value,
      value: payment.bag!.price,
      expiresIn: 60 * 15, // 15 minutes
      customer: {
        name,
        phone: payment.bag!.user!.phone,
      },
      additionalInfo: [
        {
          key: "payment_id",
          value: payment.id.value,
        },
      ],
    });

    if (!charge.transactionID) {
      throw new Error("Transaction ID is missing in the provider response");
    }

    return { 
      qrcode: charge.qrCodeImage!, 
      code: charge.brCode!, 
      providerTransactionId: charge.transactionID,
    };
  }

  async refund(payment: Payment) {
    const { id, bag, providerTransactionId } = payment;

    const response = await this.client.refund.create({
      correlationID: id.value,
      value: Number(bag?.price),
      transactionEndToEndId: String(providerTransactionId)
    });

    return response;
  }
}
