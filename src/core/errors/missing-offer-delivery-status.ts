export class MissingOfferDeliveryStatusError extends Error {
  constructor(reference_product: string, order_id: string) {
    super(
      `Não foi especificado o status de entrega do produto: ${reference_product} (id: ${order_id})`
    );
  }
}
