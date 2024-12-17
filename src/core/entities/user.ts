// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";

// Types
import { OnRegisteredEvent } from "@/core/events/on-registered";
import { Optional } from "@/core/types/optional";

// Events
import { DomainEvents } from "@/core/events/domain-events";
import { OnRequestHelpEvent } from "@/core/events/on-request-help";
import { OnUpdatePasswordRequestEvent } from "@/core/events/on-password-update-requested";

export type Role = "USER" | "PRODUCER" | "MANAGER" | "BROKER";

export interface UserProps extends EntityRequest {
  first_name: string;
  last_name: string;
  email: string;
  cpf: string;
  phone: string;
  password: string | null;
  roles: Role[];
  verified_at: Date | null;
  photo: string | null;
}

export class User extends Entity<UserProps> {
  get first_name() {
    return this.props.first_name;
  }

  get last_name() {
    return this.props.last_name;
  }

  get email() {
    return this.props.email;
  }

  get cpf() {
    return this.props.cpf;
  }

  get phone() {
    return this.props.phone;
  }

  get password(): string | null {
    return this.props.password;
  }

  get roles() {
    return this.props.roles;
  }

  get verified_at() {
    return this.props.verified_at;
  }

  get photo() {
    return this.props.photo;
  }

  set first_name(value: string) {
    this.props.first_name = value;
  }

  set last_name(value: string) {
    this.props.last_name = value;
  }

  set email(value: string) {
    this.props.email = value;
  }

  set cpf(value: string) {
    this.props.cpf = value;
  }

  set phone(value: string) {
    this.props.phone = value;
  }

  set photo(value: string | null) {
    this.props.photo = value;
  }

  set password(value: string) {
    this.props.password = value;
  }

  verify() {
    this.props.verified_at = new Date();
    this.touch();
  }

  reset() {
    DomainEvents.events.push({
      entity: this,
      name: OnUpdatePasswordRequestEvent.name,
    });
  }

  get admin() {
    return !!this.props.roles.find(
      (role) => role === "MANAGER" || role === "BROKER"
    );
  }

  help(content: string) {
    DomainEvents.events.push({
      entity: this,
      name: OnRequestHelpEvent.name,
      payload: {
        id: this.id.value,
        content,
      },
    });
  }

  static create(
    props: Optional<UserProps, "password" | "verified_at" | "photo">
  ) {
    const user = new User({
      ...props,
      password: props.password ?? null,
      verified_at: props.verified_at ?? null,
      photo: props.photo ?? null,
    });

    const fresh = !props.id;

    if (fresh) {
      DomainEvents.events.push({ entity: user, name: OnRegisteredEvent.name });
    }

    return user;
  }
}
