// Entities
import { Payment } from "@/core/entities/payment";

// Providers
import { PixProvider, RefundRequest } from "@/core/payment/pix-provider";
import { ChargeRefund } from "@woovi/node-sdk/dist/clients/charge-refund/commonTypes";

export class MockedPixProvider implements PixProvider {
  async charge(_: Payment) {
    return {
      qrcode: `https://res.cloudinary.com/dwm7zdljf/image/upload/v1729723931/assets/default-qr_code.jpg`,
      code: `00020101021226950014br.gov.bcb.pix2573api.openpix.com.br/api/testaccount/qr/v1/2c10de30d5374620beb80ae9b2af8f9f520400005303986540510.005802BR5925ASSOCIACAO_EDUCACIONAL_PA6009Sao_Paulo622905252c10de30d5374620beb80ae9b630435F7`,
    };
  }

  async refund({ payment_id, bag }: RefundRequest): Promise<ChargeRefund> {
    return {
      value: bag.price,
      status: "CONFIRMED",
      correlationID: payment_id,
      endToEndId: ``,
      time: new Date().toISOString(),
      comment: "Pagamento estornado com sucesso",
    };
  }
}
