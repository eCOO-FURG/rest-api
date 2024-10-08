// Errors
import { DomainError } from "@/core/errors/domain-error";

export class UnauthorizedError extends DomainError {
  constructor() {
    super(`Não autorizado`, "unauthorized");
  }
}
