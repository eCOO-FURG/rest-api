// Entities
import { Address, AddressProps } from "@/core/entities/address";

// Types
import { View } from "@/infra/types/view";

export class AddressPresenter {
  static toHttp(address?: Address): View<AddressProps> {
    if (address) {
      return {
        id: address.id.value,
        complement: address.complement,
        number: address.number,
        street: address.street,
        postal_code: address.postal_code,
        created_at: address.created_at,
        updated_at: address.updated_at,
      };
    }
  }
}
