// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { Address } from "@/core/entities/address";

// Libs
import { faker } from "@faker-js/faker";

export function makeAddress(props: Partial<Address> = {}) {
  const address = Address.create({
    ...props,
    id: props.id ?? new UUID(),
    street: props.street ?? faker.location.streetAddress(),
    number: props.number ?? faker.location.buildingNumber(),
    complement: props.complement ?? faker.location.secondaryAddress(),
    neighborhood: props.neighborhood ?? faker.location.streetAddress(),
    postal_code: props.postal_code ?? faker.location.zipCode(),
  });

  return address;
}
