// Errors
import { DomainError } from "@/core/errors/domain-error";

export class ResourceNotVerifiedError extends DomainError {
  constructor(resource: string, identifier: string) {
    super(
      `${resource} ${identifier} não foi verificado(a).`,
      "resource-not-verified"
    );
  }
}
