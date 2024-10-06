// Errors
import { DomainError } from "@/core/errors/domain-error";

export class WrongCredentialsError extends DomainError {
  constructor() {
    super(`As credenciais de acesso não são válidas.`, "wrong-credentials");
  }
}
