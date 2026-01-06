// Errors
import { DomainError } from "@/core/errors/domain-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";
import { FarmNotActiveError } from "@/core/errors/farm-not-active";
import { UserNotVerifiedError } from "@/core/errors/user-not-verified";
import { WrongCredentialsError } from "@/core/errors/wrong-credentials";
import { OfferAlreadyOrderedError } from "@/core/errors/offer-already-ordered";
import { UnauthorizedError } from "@/core/errors/unauthorized";
import { SessionExpiredError } from "@/core/errors/session-expired";
import { ResourceClosedError } from "@/core/errors/resource-closed";
import { MissingFieldError } from "@/core/errors/missing-field";
import { ResourceNotVerifiedError } from "@/core/errors/resource-not-verified";
import { InvalidFieldError } from "@/core/errors/invalid-field";
import { InvalidWeightError } from "@/core/errors/invalid-weight";
import { UnavailableAmountError } from "@/core/errors/unavailable-amount";

interface MappedDomainError {
  status: number;
  errors: (typeof DomainError)[];
}

export const MAPPED_DOMAIN_ERRORS: MappedDomainError[] = [
  {
    status: 401,
    errors: [UnauthorizedError, SessionExpiredError],
  },
  {
    status: 400,
    errors: [WrongCredentialsError, InvalidWeightError, MissingFieldError, InvalidFieldError],
  },
  {
    status: 403,
    errors: [
      ResourceNotVerifiedError,
      FarmNotActiveError,
      ResourceClosedError,
      UserNotVerifiedError,
    ],
  },
  {
    status: 404,
    errors: [ResourceNotFoundError],
  },
  {
    status: 409,
    errors: [ResourceAlreadyExistsError, UnavailableAmountError, OfferAlreadyOrderedError],
  },
];

export class HttpErrorMapper {
  static find(error: DomainError) {
    const found = MAPPED_DOMAIN_ERRORS.find((item) =>
      item.errors.find((constructor) => error instanceof constructor),
    );

    if (!found) {
      return null;
    }

    return {
      name: error.name,
      status: found.status,
      message: error.message,
      code: error.code,
    };
  }
}
