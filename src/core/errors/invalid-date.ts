// Errors
import { DomainError } from "@/core/errors/domain-error";

export class InvalidDateError extends DomainError {
  constructor() {
    super("A data de expiração não pode ser menor que a data atual.", "invalid-date");
  }
}
