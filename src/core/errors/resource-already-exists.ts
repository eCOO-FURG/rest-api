// Errors
import { DomainError } from "@/core/errors/domain-error";

export class ResourceAlreadyExistsError extends DomainError {
  constructor(resource: string, identifier: string) {
    super(`${resource} ${identifier} já existe.`, "resource-already-exists");
  }
}
