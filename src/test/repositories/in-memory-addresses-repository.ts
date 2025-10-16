// Repositories
import {
  AddressesRepository,
  AddressesRepositorySearchRequest,
  AddressRepositoryReturnType,
  AddressEntityOf,
} from "@/core/repositories/addresses-repository";

export class InMemoryAddressesRepository implements AddressesRepository {
  items: AddressEntityOf<AddressRepositoryReturnType>[] = [];

  async find<T extends AddressRepositoryReturnType>(
    _: T,
    { id, complement, neighborhood, number, street, postal_code }: AddressesRepositorySearchRequest,
  ): Promise<AddressEntityOf<T> | null> {
    const address = this.items.find((item) =>
      Boolean(
        (!id || item.id.equals(id)) &&
          (!street || item.street === street) &&
          (!number || item.number === number) &&
          (!complement || item.complement === complement) &&
          (!neighborhood || item.neighborhood === neighborhood) &&
          (!postal_code || item.postal_code === postal_code),
      ),
    );

    if (!address) {
      return null;
    }

    return address as AddressEntityOf<T>;
  }
}
