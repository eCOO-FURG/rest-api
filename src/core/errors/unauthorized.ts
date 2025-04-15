// Errors
import { DomainError } from "@/core/errors/domain-error";

export class UnauthorizedError extends DomainError {
  constructor() {
    super(`Usuário não possui permissão para acessar este recurso.`, "unauthorized");
  }
}
