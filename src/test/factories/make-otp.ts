// Entities
import { Otp } from "@/core/entities/otp";
import { UUID } from "@/core/entities/aggregates/uuid";

// Libs
import { faker } from "@faker-js/faker";

export function makeOtp(props: Partial<Otp> = {}) {
  return Otp.create({
    ...props,
    user_id: props.user_id ?? new UUID(),
    value: props.value ?? faker.internet.password.toString(),
    used: props.used ?? false,
  });
}
