// Entities
import { BagAndDetails } from "@/core/entities/aggregates/bag-and-details";
import { Payment } from "@/core/entities/payment";

// Payments
import { PixProvider } from "@/core/payment/pix-provider";

// Libraries
import { createClient } from "@woovi/node-sdk";

// Environment
import { env } from "@/infra/env";

// Logs
import { Logger } from "@/infra/logs/logger";

// Entities

type Client = ReturnType<typeof createClient>;

export class OpenPix implements PixProvider {
  private client: Client;

  constructor() {
    this.client = createClient({ appId: env.PIX_PROVIDER_API_KEY! });
  }

  async charge(bag: BagAndDetails) {
    try {
      const { charge } = await this.client.charge.create({
        correlationID: bag.payment!.id.value,
        value: bag.total,
        expiresIn: 60 * 15,
        customer: {
          name: `${bag.customer.first_name} ${bag.customer.last_name}`,
          phone: bag.customer.phone.value,
        },
        additionalInfo: [
          {
            key: "payment_id",
            value: bag.payment!.id.value,
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
        value: payment.bag!.total,
      });
    } catch (error) {
      Logger.log(error);
    }
  }
}
