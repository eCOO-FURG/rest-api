// Errors
import { DomainError } from "@/core/errors/domain-error";

export class ResourceReachedLimitError extends DomainError {
  constructor(resource: string, identifier: string, item: string) {
    super(
      `${resource} ${identifier} atingiu o limite de ${item}`,
      "resource-reached-limit",
    );
  }
}
