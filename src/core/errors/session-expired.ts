// Errors
import { DomainError } from "@/core/errors/domain-error";

export class SessionExpiredError extends DomainError {
  constructor() {
    super(`Sessão expirada.`, "session-expired");
  }
}
