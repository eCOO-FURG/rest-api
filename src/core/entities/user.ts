// Entities
import { Phone } from "@/core/entities/phone";
import { CPF } from "@/core/entities/cpf";
import { Entity, EntityRequest } from "@/core/entities/entity";

// Types
import { OnRegisteredEvent } from "@/core/events/on-registered";
import { Optional } from "@/core/types/optional";

// Events
import { DomainEvents } from "@/core/events/domain-events";
import { OnRequestHelpEvent } from "@/core/events/on-request-help";
import { OnUpdatePasswordRequestEvent } from "@/core/events/on-password-update-requested";

export type UserRole = (typeof User.roles)[number];

export interface UserProps extends EntityRequest {
  first_name: string;
  last_name: string;
  email: string;
  cpf: CPF;
  phone: Phone;
  password: string | null;
  verified_at: Date | null;
  photo: string | null;
  chat: string | null;
  roles: UserRole[];
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

  get chat() {
    return this.props.chat;
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

  set cpf(value: CPF) {
    this.props.cpf = value;
  }

  set phone(value: Phone) {
    this.props.phone = value;
  }

  set photo(value: string | null) {
    this.props.photo = value;
  }

  set password(value: string) {
    this.props.password = value;
  }

  set chat(value: string | null) {
    this.props.chat = value;
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
    for (const role of this.props.roles) {
      if (role === "MANAGER" || role === "BROKER") {
        return true;
      }
    }

    return false;
  }

  help(content: string) {
    DomainEvents.events.push({
      entity: this,
      name: OnRequestHelpEvent.name,
      payload: { content },
    });
  }

  static create(
    props: Optional<UserProps, "password" | "verified_at" | "photo" | "chat">
  ) {
    const user = new User({
      ...props,
      password: props.password ?? null,
      verified_at: props.verified_at ?? null,
      photo: props.photo ?? null,
      chat: props.chat ?? null,
    });

    const fresh = !props.id;

    if (fresh) {
      DomainEvents.events.push({ entity: user, name: OnRegisteredEvent.name });
    }

    return user;
  }

  static roles = ["USER", "PRODUCER", "MANAGER", "BROKER"] as const;
}
