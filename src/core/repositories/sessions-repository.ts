// Entities
import { Session } from "@/core/entities/session";

export interface SessionsRepository {
  create(session: Session): Promise<void>;
}
