// Errors
import { DomainError } from "@/core/errors/domain-error";

export class FarmNotActiveError extends DomainError {
  constructor() {
    super(`O agronegócio não está ativo.`, "farm-not-active");
  }
}
