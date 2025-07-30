// Entities
import { Session } from "@/core/entities/session";

export type SessionRepositoryReturnType = "session";

export type SessionEntityOf<T extends SessionRepositoryReturnType> =
  T extends "session" ? Session : never;

export interface SessionsRepositorySearchRequest {
  ip?: string;
  agent?: string;
  since?: Date;
  user?: { id: string };
}
export interface SessionsRepository {
  create(session: Session): Promise<void>;
  find<T extends SessionRepositoryReturnType>(
    type: T,
    filters: SessionsRepositorySearchRequest,
  ): Promise<SessionEntityOf<T> | null>;
}
