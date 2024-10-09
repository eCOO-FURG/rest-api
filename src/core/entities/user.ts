// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";

// Types
import { Optional } from "@/core/types/optional";
import { OnRegisteredEvent } from "@/core/events/on-registered";

// Events
import { DomainEvents } from "@/core/events/domain-events";
import { OnUpdatePasswordRequestEvent } from "@/core/events/on-password-update-requested";

type Role = "USER" | "PRODUCER" | "ADMIN";

export interface UserProps extends EntityRequest {
  first_name: string;
  last_name: string;
  email: string;
  cpf: string;
  phone: string;
  password: string | null;
  roles: Role[];
  verified_at: Date | null;
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

  get password() {
    return this.props.password;
  }

  get roles() {
    return this.props.roles;
  }

  get verified_at() {
    return this.props.verified_at;
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

  protect(hash: string) {
    this.props.password = hash;
    this.touch();
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

  static create(props: Optional<UserProps, "password" | "verified_at">) {
    const user = new User({
      ...props,
      password: props.password ?? null,
      verified_at: props.verified_at ?? null,
    });

    const fresh = !props.id;

    if (fresh) {
      DomainEvents.events.push({ entity: user, name: OnRegisteredEvent.name });
    }

    return user;
  }
}
