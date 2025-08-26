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

export const listUsersQuery = Joi.object({
  page: Joi.number().min(1).required(),
  first_name: Joi.string().optional(),
  last_name: Joi.string().optional(),
  roles: Joi.alternatives()
    .try(Joi.string(), Joi.array().items(Joi.string()))
    .optional(),
});

export async function listUsersController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const query = parse(listUsersQuery, request.query);
    const { page, first_name, last_name } = query;

    let rolesArray: string[] | undefined;
    if (query.roles) {
      rolesArray = Array.isArray(query.roles)
        ? query.roles
        : query.roles.split(",");
    }

    const listUsersUseCase =
      container.resolve<ListUsersUseCase>("listUsersUseCase");

    const { users } = await listUsersUseCase.execute({
      page,
      first_name,
      last_name,
      roles: rolesArray,
    });

    return response
      .status(200)
      .send(users.map((user) => UserPresenter.toHttp(user)));
  } catch (error) {
    next(error);
  }
}
