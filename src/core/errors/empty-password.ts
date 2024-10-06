// Errors
import { DomainError } from "@/core/errors/domain-error";

export class EmptyPasswordError extends DomainError {
  constructor() {
    super("Essa conta não tem uma senha definida.", "empty-password");
  }
}
