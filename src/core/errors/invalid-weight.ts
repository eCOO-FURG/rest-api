// Errors
import { DomainError } from "@/core/errors/domain-error";

export class InvalidWeightError extends DomainError {
  constructor(action: "ofertado" | "solicitado", identifier: string) {
    super(
      `Peso inválido ${action} para o produto ${identifier}.`,
      "invalid-weigth",
    );
  }
}
