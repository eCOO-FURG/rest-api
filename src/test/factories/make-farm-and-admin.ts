// Entities
import { Farm } from "@/core/entities/farm";
import { Producer } from "@/core/entities/aggregates/producer";

// Factories
import { makeUser } from "@/test/factories/make-user";
import { makeFarm } from "@/test/factories/make-farm";

export function makeProducer(farm: Farm = makeFarm()) {
  return Producer.create({
    ...farm.props,
    admin: farm.admin ?? makeUser(),
  });
}
