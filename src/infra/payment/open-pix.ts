// Entities
import { PaymentAggregate } from "@/core/entities/aggregates/payment-aggregate";

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

  async charge(payment: PaymentAggregate) {
    const name = `${payment.bag.user.first_name} ${payment.bag.user.last_name}`;

    const { charge } = await this.client.charge.create({
      correlationID: payment.id.value,
      value: payment.bag.price(),
      expiresIn: payment.expires_at?.getTime(),
      customer: {
        name,
        phone: payment.bag.user.phone,
      },
      additionalInfo: [
        {
          key: "payment_id",
          value: payment.id.value,
        },
      ],
    });

    return { qrcode: charge.qrCodeImage!, code: charge.brCode! };
  }
}
