// Entities
import { UUID } from "@/core/entities/value-objects/uuid";
import { Entity } from "./entity";

interface SessionProps {
  user_id: UUID;
  ip: string;
  agent: string;
}

export class Session extends Entity<SessionProps> {
  get user_id() {
    return this.props.user_id;
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
