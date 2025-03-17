// Errors
import { DomainError } from "@/core/errors/domain-error";

export class MissingFieldError extends DomainError {
  constructor(field: string) {
    super(`O campo '${field}' está ausente.`, "missing-field");
  }
}
