// Entities
import { User } from "@/core/entities/user";

// Libraries
import { faker } from "@faker-js/faker";

export function makeUser(props: Partial<User> = {}) {
  const cpf =
    props.cpf ??
    faker.number
      .bigInt({
        min: 11,
        max: 11,
      })
      .toString();

  return User.create({
    ...props,
    first_name: props.first_name ?? faker.person.firstName(),
    last_name: props.last_name ?? faker.person.lastName(),
    email: props.email ?? faker.internet.email(),
    cpf: props.cpf ? cpf : faker.internet.email(),
    phone: props.phone ?? faker.phone.number(),
    roles: props.roles ?? ["USER"],
    verified_at: props.verified_at,
  });
}
