// Entities
import { Market, MarketProps } from "@/core/entities/market";

// Libraries
import { faker } from "@faker-js/faker";

export function makeMarket(props: Partial<MarketProps> = {}) {
  return Market.create({
    ...props,
    name: props.name ?? faker.company.name(),
  });
}
