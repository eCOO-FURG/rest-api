// Entities
import { Session } from "@/core/entities/session";

// Repositories
import { SessionsRepository } from "@/core/repositories/sessions-repository";

export class InMemorySessionsRepository implements SessionsRepository {
  items: Session[] = [];

  async create(session: Session): Promise<void> {
    this.items.push(session);
  }
}
