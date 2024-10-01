// Types
import { Optional } from "@/core/types/optional";

// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";
import { UUID } from "@/core/entities/aggregates/uuid";

// Events
import { DomainEvents } from "@/core/events/domain-events";
import { OnOtpRequestEvent } from "@/core/events/on-otp-requested";

export interface OtpProps extends EntityRequest {
  user_id: UUID;
  value: string;
  used: boolean;
}

export class Otp extends Entity<OtpProps> {
  get user_id() {
    return this.props.user_id;
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

  static create(props: Optional<OtpProps, "used">) {
    const otp = new Otp({
      ...props,
      used: props.used ?? false,
    });

    const fresh = !props.id;

    if (fresh) {
      DomainEvents.events.push({ entity: otp, name: OnOtpRequestEvent.name });
    }

    return otp;
  }
}
