// Errors
import { DomainError } from "@/core/errors/domain-error";

export class ResourceClosedError extends DomainError {
  constructor(resource: string, identifier: string) {
    super(
      `${resource} ${identifier} não pode mais ser alterado.`,
      "resource-closed"
    );
  }
}
