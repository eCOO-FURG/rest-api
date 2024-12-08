// Entities
import { Otp } from "@/core/entities/otp";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

export interface OtpsRepositorySearchRequest {
  value: string;
  user?: { id?: string };
  used?: boolean;
}

export interface OtpsRepository {
  find(
    type: RepositoryResponse,
    filters: OtpsRepositorySearchRequest
  ): Promise<Otp | null>;
  create(otp: Otp): Promise<void>;
  update(otp: Otp): Promise<void>;
}
