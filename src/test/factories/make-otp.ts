// Entities
import { Otp, OtpProps } from "@/core/entities/otp";
import { UUID } from "@/core/entities/value-objects/uuid";

// Libs
import { faker } from "@faker-js/faker";

export function makeOtp(props: Partial<OtpProps> = {}) {
  return Otp.create({
    user_id: props.user_id ?? new UUID(),
    value: props.value ?? faker.internet.password.toString(),
    used_at: props.used_at ?? null,
  });
}
