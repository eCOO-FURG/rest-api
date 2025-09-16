// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";

// Types
import { Optional } from "@/core/types/optional";

export type WarehouseAddress = {
  CEP: string | null;
  street: string | null;
  number: string | null;
  neighborhood: string | null;
  complement: string | null;
  city: string | null;
  state: string | null;
  link: string | null;
};

export type WarehouseSocial = {
  platform: (typeof Warehouse.plataforms)[number];
  value: string;
};

export interface WarehouseProps extends EntityRequest {
  name: string;
  CNPJ: string | null;
  manager: string | null;
  email: string | null;
  phone: string | null;
  socials: WarehouseSocial[];
  address: WarehouseAddress;
  coverage: string[];
}

export class Warehouse<
  Props extends WarehouseProps = WarehouseProps,
> extends Entity<Props> {
  get name() {
    return this.props.name;
  }

  get manager(): string | null {
    return this.props.manager;
  }

  get CNPJ(): string | null {
    return this.props.CNPJ;
  }

  get email(): string | null {
    return this.props.email;
  }

  get phone(): string | null {
    return this.props.phone;
  }

  get socials(): WarehouseSocial[] {
    return this.props.socials;
  }

  get address(): WarehouseAddress {
    return this.props.address;
  }

  get coverage() {
    return this.props.coverage;
  }

  set name(value: string) {
    this.props.name = value;
  }

  set manager(value: string | null) {
    this.props.manager = value;
  }

  set email(value: string | null) {
    this.props.email = value;
  }

  set phone(value: string | null) {
    this.props.phone = value;
  }

  set socials(value: WarehouseSocial[]) {
    this.props.socials = value;
  }

  set CNPJ(value: string | null) {
    this.props.CNPJ = value;
  }

  set address(value: WarehouseAddress) {
    this.props.address = value;
  }

  set coverage(value: string[]) {
    this.props.coverage = value;
  }

  static create(
    props: Optional<
      WarehouseProps,
      | "name"
      | "CNPJ"
      | "manager"
      | "email"
      | "phone"
      | "socials"
      | "address"
      | "coverage"
    >,
  ) {
    return new Warehouse({
      name: props.name ?? "Armazém Padrão",
      CNPJ: props.CNPJ ?? null,
      manager: props.manager ?? null,
      email: props.email ?? null,
      phone: props.phone ?? null,
      socials: props.socials ?? [],
      address: props.address ?? {
        CEP: null,
        street: null,
        number: null,
        neighborhood: null,
        complement: null,
        city: null,
        state: null,
        link: null,
      },
      coverage: props.coverage ?? [],
    });
  }

  static plataforms = [
    "instagram",
    "facebook",
    "whatsapp",
    "telegram",
    "phone",
    "youtube",
    "x",
    "tiktok",
  ];
}
