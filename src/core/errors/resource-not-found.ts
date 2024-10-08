// Errors
import { DomainError } from "@/core/errors/domain-error";

export class ResourceNotFoundError extends DomainError {
  constructor(resource: string, identifier: string) {
    super(`${resource} ${identifier} não existe.`, "resource-not-found");
  }
}
