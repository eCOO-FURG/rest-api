// Entities
import { Address } from "@/core/entities/address";

// Repositories
import {
  AddressesRepository,
  AddressesRepositoryResponse,
  AddressesRepositorySearchRequest,
} from "@/core/repositories/addresses-repository";

// Utils
import { find } from "@/core/utils/find";

export class InMemoryAddressesRepository implements AddressesRepository {
  items: Address[] = [];

  async search({
    id,
    complement,
    neighborhood,
    number,
    street,
    postal_code,
  }: AddressesRepositorySearchRequest): Promise<AddressesRepositoryResponse | null> {
    const address = await find<Address>(
      this.items,
      async (item) =>
        (!id || item.id.equals(id)) &&
        (!street || item.street === street) &&
        (!number || item.number === number) &&
        (!complement || item.complement === complement) &&
        (!neighborhood || item.neighborhood === neighborhood) &&
        (!postal_code || item.postal_code === postal_code)
    );

    if (!address) return null;

    return address as AddressesRepositoryResponse;
  }

  async create(address: Address): Promise<void> {
    this.items.push(address);
  }
}
