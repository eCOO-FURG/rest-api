// Entities
import { Otp } from "@/core/entities/otp";

export interface OtpsRepository {
  findValid(user_id: string): Promise<Otp | null>;
  create(otp: Otp): Promise<void>;
  update(otp: Otp): Promise<void>;
}
