// Errors
import { DomainError } from "@/core/errors/domain-error";

export class InvalidFieldError extends DomainError {
  constructor(field: string) {
    super(`O campo '${field}' é inválido.`, "invalid-field");
  }
}
