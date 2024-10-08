// Errors
import { DomainError } from "@/core/errors/domain-error";

export class UserAlreadyVerified extends DomainError {
  constructor(identifier: string) {
    super(`Usuário ${identifier} já está verificado.`, "user-already-verified");
  }
}
