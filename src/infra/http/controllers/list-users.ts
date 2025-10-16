// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Container
import container from "@/infra/container";

// Use-cases
import { ListUsersUseCase } from "@/core/use-cases/list-users";

// Presenters
import { UserPresenter } from "@/infra/http/presenters/user-presenter";

// Validation
import { parse } from "@/infra/http/validation/parse";
import { options } from "../validation/options";

// Utils
import { toArray } from "@/infra/utils/to-array";
import { toDate } from "@/infra/utils/to-date";

// Entities
import { User } from "@/core/entities/user";

export const listUsersQuery = Joi.object({
  page: Joi.number().required().min(1),
  first_name: Joi.string().optional(),
  last_name: Joi.string().optional(),
  roles: options(User.roles).optional(),
  since: Joi.string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "DD-MM-YYYY")
    .optional(),
  before: Joi.string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "DD-MM-YYYY")
    .optional(),
});

export async function listUsersController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { page, first_name, last_name, roles, since, before } = parse(
      listUsersQuery,
      request.query,
    );

    const listUsersUseCase = container.resolve<ListUsersUseCase>("listUsersUseCase");

    const { users } = await listUsersUseCase.execute({
      page,
      first_name,
      last_name,
      roles: toArray(roles),
      since: toDate(since),
      before: toDate(before),
    });

    return response.status(200).send(users.map((user) => UserPresenter.toHttp(user)));
  } catch (error) {
    next(error);
  }
}
