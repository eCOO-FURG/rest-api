// Entities
import { Otp } from "@/core/entities/otp";

// Repositories
import { OtpsRepository } from "@/core/repositories/otps-repositoy";

export class InMemoryOtpsRepository implements OtpsRepository {
  items: Otp[] = [];

  async findValid(user_id: string): Promise<Otp | null> {
    const valid = this.items.find(
      (item) => item.user_id.equals(user_id) && item.used === false
    );

    if (!valid) return null;

    return valid;
  }

  async create(otp: Otp): Promise<void> {
    this.items.push(otp);
  }

  async update(otp: Otp): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(otp.id));

    this.items[index] = otp;
  }
}
