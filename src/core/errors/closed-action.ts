// Errors
import { DomainError } from "@/core/errors/domain-error";

export class ClosedActionError extends DomainError {
  constructor(action: "ofertar" | "enviar" | "comprar", identifier: string) {
    super(
      `Não é possível ${action} produtos no ciclo ${identifier} hoje.`,
      "closed-action"
    );
  }
}
