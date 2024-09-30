// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";

export interface AddressProps extends EntityRequest {
  street: string;
  number: string;
  neighborhood: string;
  complement: string;
  postal_code: string;
}

export class Address extends Entity<AddressProps> {
  get postal_code() {
    return this.props.postal_code;
  }

  get street() {
    return this.props.street;
  }

  get number() {
    return this.props.number;
  }

  get neighborhood() {
    return this.props.neighborhood;
  }

  get complement() {
    return this.props.complement;
  }

  static create(props: AddressProps) {
    const address = new Address(props);

    return address;
  }
}
