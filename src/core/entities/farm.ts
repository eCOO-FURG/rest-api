// Types
import { Optional } from "@/core/types/optional";

// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";
import { UUID } from "@/core/entities/aggregates/uuid";
import { User } from "@/core/entities/user";
import { Offer } from "@/core/entities/offer";

export type FarmStatus = (typeof Farm.statuses)[number];

export interface FarmProps extends EntityRequest {
  admin_id: UUID;
  admin?: User;

  name: string;
  tally: string;
  description: string | null;
  photo: string | null;
  fee: number;

  status: FarmStatus;

  images: string[];
  offers: Offer[];
}

export type OptionalFarmProps = Optional<
  FarmProps,
  "status" | "fee" | "description" | "photo" | "images" | "offers"
>;

export class Farm<Props extends FarmProps = FarmProps> extends Entity<Props> {
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

  get fee() {
    return this.props.fee;
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

  set images(value: string[]) {
    this.props.images = value;
  }

  set fee(value: number) {
    this.props.fee = value;
  }

  get active() {
    return this.props.status === "ACTIVE";
  }

  get offers() {
    return this.props.offers;
  }

  set offers(value: Offer[]) {
    this.props.offers = value;
  }

  static create(props: OptionalFarmProps) {
    return new Farm({
      ...props,
      status: props.status ?? "PENDING",
      fee: props.fee ?? 20,
      description: props.description ?? null,
      photo: props.photo ?? null,
      images: props.images ?? [],
      offers: props.offers ?? [],
    });
  }

  static statuses = ["ACTIVE", "INACTIVE", "PENDING"] as const;
}
