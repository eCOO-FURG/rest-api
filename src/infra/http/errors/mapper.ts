// Errors
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

type Constructor<T> = new (...args: any[]) => T;

const mappedDomainErrors: {
  code: number;
  errors: Constructor<Error>[];
}[] = [
  {
    code: 400,
    errors: [WrongCredentialsError, WrongCredentialsError, InvalidWeightError],
  },
  {
    code: 403,
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
    code: 404,
    errors: [ResourceNotFoundError],
  },
  {
    code: 409,
    errors: [UnavailableAmountError],
  },
];

export class HttpErrorMapper {
  static find(error: Error) {
    const found = mappedDomainErrors.find((item) =>
      item.errors.find((constructor) => error instanceof constructor)
    );

    if (!found) return null;

    return {
      code: found.code,
      message: error.message,
    };
  }
}
