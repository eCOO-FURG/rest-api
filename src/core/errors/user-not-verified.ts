// Errors
import { DomainError } from "@/core/errors/domain-error";

export class UserNotVerifiedError extends DomainError {
  code = "user-not-verified";

  constructor() {
    super(`O usuário não está verificado.`, "user-not-verified");
  }
}
