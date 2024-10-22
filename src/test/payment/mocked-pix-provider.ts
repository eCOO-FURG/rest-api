// Entities
import { PaymentAggregate } from "@/core/entities/aggregates/payment-aggregate";

// Providers
import { PixProvider } from "@/core/payment/pix-provider";

export class MockedPixProvider implements PixProvider {
  async charge(aggregate: PaymentAggregate) {
    return {
      qrcode: `qrcode-${aggregate.id.value}`,
      code: `code-${aggregate.id.value}`,
    };
  }
}
