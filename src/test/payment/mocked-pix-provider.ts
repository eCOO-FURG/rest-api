// Entities
import { PaymentAggregate } from "@/core/entities/aggregates/payment-aggregate";

// Providers
import { PixProvider } from "@/core/payment/pix-provider";

export class MockedPixProvider implements PixProvider {
  async charge(_: PaymentAggregate) {
    return {
      qrcode: `https://res.cloudinary.com/dwm7zdljf/image/upload/v1729723931/assets/default-qr_code.jpg`,
      code: `00020101021226950014br.gov.bcb.pix2573api.openpix.com.br/api/testaccount/qr/v1/2c10de30d5374620beb80ae9b2af8f9f520400005303986540510.005802BR5925ASSOCIACAO_EDUCACIONAL_PA6009Sao_Paulo622905252c10de30d5374620beb80ae9b630435F7`,
      
    };
  }
}
