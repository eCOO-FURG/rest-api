// Errors
import { DomainError } from "@/core/errors/domain-error";

export class FieldNotProviderError extends DomainError {
  constructor(field: string) {
    super(`O campo ${field} não foi fornecido.`, "invalid-field");
  }
}
