// Entities
import { CPF } from "@/core/entities/cpf";
import { User } from "@/core/entities/user";
import { Phone } from "@/core/entities/phone";

// Libs
import { faker } from "@faker-js/faker";

export function makeUser(props: Partial<User> = {}) {
  const cpf =
    props.cpf ?? new CPF(faker.number.bigInt({ min: 11, max: 11 }).toString());

  return User.create({
    ...props,
    first_name: props.first_name ?? faker.person.firstName(),
    last_name: props.last_name ?? faker.person.lastName(),
    email: props.email ?? faker.internet.email(),
    cpf,
    phone: props.phone ?? new Phone(faker.phone.number()),
    roles: props.roles ?? ["USER"],
    verified_at: props.verified_at,
  });
}
