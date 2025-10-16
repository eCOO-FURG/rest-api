// Types
import { Optional } from "@/core/types/optional";

// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";
import { UUID } from "@/core/entities/aggregates/uuid";
import { User } from "@/core/entities/user";

// Utils
import { randomCode } from "@/core/utils/random-code";

export interface OtpProps extends EntityRequest {
  user_id: UUID;
  user?: User;

  value: string;
  used: boolean;
}

export class Otp extends Entity<OtpProps> {
  get user_id() {
    return this.props.user_id;
  }

  get user() {
    return this.props.user;
  }

  get value(): string {
    return this.props.value;
  }

  get used() {
    return this.props.used;
  }

  expire() {
    this.props.used = true;
    this.touch();
  }

  static create(props: Optional<OtpProps, "used" | "value">) {
    return new Otp({
      ...props,
      used: props.used ?? false,
      value: props.value ?? randomCode(),
    });
  }
}
