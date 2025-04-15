// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";

// Types
import { Optional } from "@/core/types/optional";

export interface AddressProps extends EntityRequest {
  street: string;
  number: string;
  neighborhood: string;
  complement: string | null;
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

  get format() {
    return `${this.street}, ${this.number}${this.complement ? `, ${this.complement}` : ""} - ${this.neighborhood} | ${this.postal_code}`;
  }

  static create(props: Optional<AddressProps, "complement">) {
    const address = new Address({
      ...props,
      complement: props.complement ?? null,
    });

    return address;
  }
}
