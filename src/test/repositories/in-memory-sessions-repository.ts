// Entities
import { Session } from "@/core/entities/session";

// Repositories
import {
  SessionsRepository,
  SessionsRepositorySearchRequest,
} from "@/core/repositories/sessions-repository";
import { RepositoryResponse } from "@/core/types/repository-response";

// Utils
import { find } from "@/test/utils/find";

export class InMemorySessionsRepository implements SessionsRepository {
  items: Session[] = [];

  async find(
    _: RepositoryResponse,
    { agent, ip, user, since }: SessionsRepositorySearchRequest
  ): Promise<Session | null> {
    const session = await find<Session>(
      this.items,
      async (item) =>
        (!agent || item.agent === agent) &&
        (!ip || item.ip === ip) &&
        Boolean(!user || item.user?.id.equals(user.id)) &&
        (!since || item.created_at >= since)
    );

    if (!session) return null;

    return session;
  }

  async create(session: Session): Promise<void> {
    this.items.push(session);
  }
}
