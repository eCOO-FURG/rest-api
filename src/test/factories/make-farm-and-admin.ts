// Entities
import { Farm } from "@/core/entities/farm";
import { FarmAndAdmin } from "@/core/entities/aggregates/farm-and-admin";

// Factories
import { makeUser } from "@/test/factories/make-user";
import { makeFarm } from "@/test/factories/make-farm";

export function makeFarmAndAdmin(farm: Farm = makeFarm()) {
  return FarmAndAdmin.create({
    ...farm.props,
    admin: farm.admin ?? makeUser(),
  });
}
