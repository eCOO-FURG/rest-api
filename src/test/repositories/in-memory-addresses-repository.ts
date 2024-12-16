// Entities
import { Address } from "@/core/entities/address";

// Repositories
import {
  AddressesRepository,
  AddressesRepositorySearchRequest,
} from "@/core/repositories/addresses-repository";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

// Utils
import { find } from "@/test/utils/find";

export class InMemoryAddressesRepository implements AddressesRepository {
  items: Address[] = [];

  async find(
    _: RepositoryResponse,
    {
      id,
      complement,
      neighborhood,
      number,
      street,
      postal_code,
    }: AddressesRepositorySearchRequest
  ): Promise<Address | null> {
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

    return address;
  }
}
