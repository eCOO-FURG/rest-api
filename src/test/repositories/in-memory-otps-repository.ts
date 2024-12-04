// Entities
import { Otp } from "@/core/entities/otp";

// Repositories
import {
  OtpsRepository,
  OtpsRepositorySearchRequest,
} from "@/core/repositories/otps-repositoy";
import { RepositoryResponse } from "@/core/types/repository-response";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Utils
import { find } from "@/test/utils/find";

export class InMemoryOtpsRepository implements OtpsRepository {
  items: Otp[] = [];

  async find(
    _: RepositoryResponse,
    { user_id, value, used }: OtpsRepositorySearchRequest
  ): Promise<Otp | null> {
    const otp = await find<Otp>(
      this.items,
      async (item) =>
        (!user_id || item.user_id.equals(user_id)) &&
        (!used || item.used === used) &&
        (!value || item.value === value)
    );

    if (!otp) return null;

    return otp;
  }

  async create(otp: Otp): Promise<void> {
    this.items.push(otp);
  }

  async update(otp: Otp): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(otp.id));

    this.items[index] = otp;
  }
}
