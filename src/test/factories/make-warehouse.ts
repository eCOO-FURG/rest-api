// Entities
import { Warehouse, WarehouseProps } from "@/core/entities/warehouse";

// Libraries
import { faker } from "@faker-js/faker";

export function makeWarehouse(props: Partial<WarehouseProps> = {}) {
  return Warehouse.create({
    ...props,
    name: props.name ?? faker.company.name(),
    CNPJ: props.CNPJ ?? faker.datatype.uuid(),
    manager: props.manager ?? faker.name.fullName(),
    email: props.email ?? faker.internet.email(),
    phone: props.phone ?? faker.phone.number(),
    socials: props.socials ?? [],
    address: props.address ?? {
      CEP: faker.location.zipCode(),
      street: faker.location.street(),
      number: faker.location.buildingNumber(),
      neighborhood: faker.location.street(),
      complement: faker.location.secondaryAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      link: faker.internet.url(),
    },
    coverage: props.coverage ?? [],
  });
}
