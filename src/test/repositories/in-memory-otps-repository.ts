// Entities
import { Otp } from "@/core/entities/otp";

// Repositories
import { OtpsRepository, OtpsRepositorySearchRequest, OtpRepositoryReturnType, OtpEntityOf } from "@/core/repositories/otps-repositoy";

export class InMemoryOtpsRepository implements OtpsRepository {
  items: Otp[] = [];

  async find<T extends OtpRepositoryReturnType>(_: T, { value, used, user }: OtpsRepositorySearchRequest): Promise<OtpEntityOf<T> | null> {
    const otp = this.items.find((item) =>
      Boolean((!user?.id || item.user?.id.equals(user.id)) && (!used || item.used === used) && (!value || item.value === value)),
    );

    if (!otp) return null;

    return otp as OtpEntityOf<T>;
  }

  async create(otp: Otp): Promise<void> {
    this.items.push(otp);
  }

  async update(otp: Otp): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(otp.id));

    this.items[index] = otp;
  }
}
