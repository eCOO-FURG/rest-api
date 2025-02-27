// Errors
import { DomainError } from "@/core/errors/domain-error";

export class MissingFieldError extends DomainError {
  constructor(fieldName: string) {
    super(`O campo '${fieldName}' está ausente.`, "missing-field");
  }
}
