// Errors
import { DomainError } from "@/core/errors/domain-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";
import { ClosedActionError } from "@/core/errors/closed-action";
import { EmptyPasswordError } from "@/core/errors/empty-password";
import { FarmNotActiveError } from "@/core/errors/farm-not-active";
import { UserNotVerifiedError } from "@/core/errors/user-not-verified";
import { UserAlreadyVerified } from "@/core/errors/user-already-verified";
import { WrongCredentialsError } from "@/core/errors/wrong-credentials";
import { InvalidWeightError } from "@/core/errors/invalid-weight";
import { UnavailableAmountError } from "@/core/errors/unavailable-amount";
import { UnauthorizedError } from "@/core/errors/unauthorized";

const mappedDomainErrors: {
  status: number;
  errors: (typeof DomainError)[];
}[] = [
  {
    status: 400,
    errors: [WrongCredentialsError, WrongCredentialsError, InvalidWeightError],
  },
  {
    status: 403,
    errors: [
      ResourceAlreadyExistsError,
      ClosedActionError,
      EmptyPasswordError,
      FarmNotActiveError,
      UserNotVerifiedError,
      UserAlreadyVerified,
      UnauthorizedError,
    ],
  },
  {
    status: 404,
    errors: [ResourceNotFoundError],
  },
  {
    status: 409,
    errors: [UnavailableAmountError],
  },
];

export class HttpErrorMapper {
  static find(error: DomainError) {
    const found = mappedDomainErrors.find((item) =>
      item.errors.find((constructor) => error instanceof constructor)
    );

    if (!found) return null;

    return {
      name: error.name,
      status: found.status,
      message: error.message,
      code: error.code,
    };
  }
}
