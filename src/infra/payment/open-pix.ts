// Entities
import { Payment } from "@/core/entities/payment";
// Payments
import { PixProvider } from "@/core/payment/pix-provider";

// Libraries
import { createClient } from "@woovi/node-sdk";

// Env
import { env } from "@/infra/env";

// Logs
import { Logger } from "@/infra/logs/logger";

type Client = ReturnType<typeof createClient>;

export class OpenPix implements PixProvider {
  private client: Client;

  constructor() {
    this.client = createClient({ appId: env.PIX_PROVIDER_API_KEY });
  }

  async charge(payment: Payment) {
    try {
      const name = `${payment.bag!.user!.first_name} ${
        payment.bag!.user!.last_name
      }`;

      const { charge } = await this.client.charge.create({
        correlationID: payment.id.value,
        value: payment.bag!.price,
        expiresIn: 60 * 15, // 15 minutes
        customer: {
          name,
          phone: payment.bag!.user!.phone.value,
        },
        additionalInfo: [
          {
            key: "payment_id",
            value: payment.id.value,
          },
        ],
      });

      return { qrcode: charge.qrCodeImage!, code: charge.brCode! };
    } catch (error) {
      Logger.log(error);
      throw error;
    }
  }

  async refund(payment: Payment) {
    try {
      await this.client.refund.create({
        correlationID: payment.id.value,
        transactionEndToEndId: payment.id.value,
        value: payment.bag!.price,
      });
    } catch (error) {
      Logger.log(error);
    }
  }
}
