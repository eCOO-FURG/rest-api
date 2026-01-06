// Errors
import { DomainError } from "@/core/errors/domain-error";

export class OfferAlreadyOrderedError extends DomainError {
  constructor() {
    super(
      `A oferta já possui pedidos associados e não pode ser alterada ou removida.`,
      "offer-already-ordered",
    );
  }
}
