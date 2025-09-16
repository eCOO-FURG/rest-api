// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";

export type WarehouseAddress = {
  CEP: string;
  street: string;
  number: string;
  neighborhood: string;
  complement: string | null;
  city: string;
  state: string;
  link: string | null;
};

export type WarehouseSocial = {
  platform: (typeof Warehouse.socialPlatforms)[number];
  value: string;
};

export interface WarehouseProps extends EntityRequest {
  name: string;
  CNPJ: string;
  manager: string;
  email: string;
  phone: string;
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

  get manager() {
    return this.props.manager;
  }

  get CNPJ() {
    return this.props.CNPJ;
  }

  get email() {
    return this.props.email;
  }

  get phone() {
    return this.props.phone;
  }

  get socials() {
    return this.props.socials;
  }

  get address() {
    return this.props.address;
  }

  get coverage() {
    return this.props.coverage;
  }

  set name(value: string) {
    this.props.name = value;
  }

  set manager(value: string) {
    this.props.manager = value;
  }

  set email(value: string) {
    this.props.email = value;
  }

  set phone(value: string) {
    this.props.phone = value;
  }

  set socials(value: WarehouseSocial[]) {
    this.props.socials = value;
  }

  set CNPJ(value: string) {
    this.props.CNPJ = value;
  }

  set address(value: WarehouseAddress) {
    this.props.address = value;
  }

  set coverage(value: string[]) {
    this.props.coverage = value;
  }

  static create(props: WarehouseProps) {
    return new Warehouse(props);
  }

  static socialPlatforms = [
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
