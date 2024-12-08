// Entities
import { Session } from "@/core/entities/session";
import { RepositoryResponse } from "../types/repository-response";

export interface SessionsRepositorySearchRequest {
  ip?: string;
  agent?: string;
  since?: Date;
  user?: { id: string };
}
export interface SessionsRepository {
  create(session: Session): Promise<void>;
  find(
    type: RepositoryResponse,
    filters: SessionsRepositorySearchRequest
  ): Promise<Session | null>;
}
