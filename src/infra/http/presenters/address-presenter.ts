// Entities
import { Address } from "@/core/entities/address";

export class AddressPresenter {
  static toHttp(address?: Address) {
    if (address)
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
