// Entities
import { Otp } from "@/core/entities/otp";

export type OtpRepositoryReturnType = "otp";

export type OtpEntityOf<T extends OtpRepositoryReturnType> = T extends "otp"
  ? Otp
  : never;

export interface OtpsRepositorySearchRequest {
  value: string;
  user?: { id?: string };
  used?: boolean;
}

export interface OtpsRepository {
  find<T extends OtpRepositoryReturnType>(
    type: T,
    filters: OtpsRepositorySearchRequest
  ): Promise<OtpEntityOf<T> | null>;
  create(otp: Otp): Promise<void>;
  update(otp: Otp): Promise<void>;
}
