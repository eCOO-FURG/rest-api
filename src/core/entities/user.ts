// Entities
import { Phone } from "@/core/entities/phone";
import { CPF } from "@/core/entities/cpf";
import { Entity, EntityRequest } from "@/core/entities/entity";

// Types
import { Optional } from "@/core/types/optional";

export type UserRole = (typeof User.roles)[number];

export interface UserProps extends EntityRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string | null;
  photo: string | null;
  chat: string | null;
  cpf: CPF;
  phone: Phone;
  verified_at: Date | null;
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

  get admin() {
    for (const role of this.props.roles) {
      if (role === "MANAGER" || role === "BROKER") {
        return true;
      }
    }

    return false;
  }

  static create(
    props: Optional<UserProps, "password" | "verified_at" | "photo" | "chat">
  ) {
    return new User({
      ...props,
      password: props.password ?? null,
      photo: props.photo ?? null,
      chat: props.chat ?? null,
      verified_at: props.verified_at ?? null,
    });
  }

  static roles = ["USER", "PRODUCER", "MANAGER", "BROKER"] as const;
}
