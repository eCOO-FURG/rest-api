// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";
import { UUID } from "@/core/entities/aggregates/uuid";
import { User } from "@/core/entities/user";
interface SessionProps extends EntityRequest {
  user_id: UUID;
  user?: User;

  ip: string;
  agent: string;
}

export class Session extends Entity<SessionProps> {
  get user_id() {
    return this.props.user_id;
  }

  get user() {
    return this.props.user;
  }

  get ip() {
    return this.props.ip;
  }

  get agent() {
    return this.props.agent;
  }

  static create(props: SessionProps) {
    const session = new Session(props);
    return session;
  }
}
