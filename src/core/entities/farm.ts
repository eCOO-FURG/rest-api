// Types
import { Optional } from "@/core/types/optional";

// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";
import { UUID } from "@/core/entities/aggregates/uuid";
import { User } from "@/core/entities/user";
export interface FarmProps extends EntityRequest {
  name: string;
  tally: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  tax: number;
  description: string | null;
  photo: string | null;
  images: Map<string, string>;
  admin_id: UUID;
  admin?: User;
}

export class Farm extends Entity<FarmProps> {
  get name() {
    return this.props.name;
  }

  get tally() {
    return this.props.tally;
  }

  get status() {
    return this.props.status;
  }

  get admin_id() {
    return this.props.admin_id;
  }

  get admin() {
    return this.props.admin;
  }

  get description(): string | null {
    return this.props.description;
  }

  get tax() {
    return this.props.tax;
  }

  get photo(): string | null {
    return this.props.photo;
  }

  get images() {
    return this.props.images;
  }

  set description(value: string) {
    this.props.description = value;
  }

  set name(value: string) {
    this.props.name = value;
  }

  set tally(value: string) {
    this.props.tally = value;
  }

  set status(status: "ACTIVE" | "INACTIVE" | "PENDING") {
    this.props.status = status;
  }

  set photo(value: string) {
    this.props.photo = value;
  }

  set images(value: Map<string, string>) {
    this.props.images = value;
  }

  static create(
    props: Optional<
      FarmProps,
      "status" | "tax" | "description" | "photo" | "images"
    >
  ) {
    const farm = new Farm({
      ...props,
      status: props.status ?? "PENDING",
      tax: props.tax ?? 20,
      description: props.description ?? null,
      photo: props.photo ?? null,
      images: props.images ?? new Map(),
    });
    return farm;
  }
}
