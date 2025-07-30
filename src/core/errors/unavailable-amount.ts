// Errors
import { DomainError } from "@/core/errors/domain-error";

export class UnavailableAmountError extends DomainError {
  constructor(identifier: string) {
    super(
      `Quantidade indisponível da oferta ${identifier}`,
      "unavailable-amount",
    );
  }
}
