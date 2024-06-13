// Types
import { Optional } from "@/core/types/optional";

// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";
import { UUID } from "@/core/entities/value-objects/uuid";

export interface OtpProps {
  user_id: UUID;
  value: string;
  used_at: Date | null;
}

export class Otp extends Entity<OtpProps> {
  get user_id() {
    return this.props.user_id;
  }

  get value(): string {
    return this.props.value;
  }

  get used_at(): Date | null {
    return this.props.used_at;
  }

  set used_at(value: Date) {
    this.props.used_at = value;
  }

  expire() {
    this.used_at = new Date();
    this.touch();
  }

  static create(props: Optional<OtpProps, "used_at"> & EntityRequest) {
    const otp = new Otp({
      ...props,
      used_at: props.used_at ?? null,
    });
    return otp;
  }
}
