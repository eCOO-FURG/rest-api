// Entities
import { Entity } from "@/core/entities/entity";

interface EmailProps {
  to: string;
  from: string;
  subject: string;
  view: string;
}

export class Email extends Entity<EmailProps> {
  get to() {
    return this.props.to;
  }

  get from() {
    return this.props.from;
  }

  get subject() {
    return this.props.subject;
  }

  get html() {
    return this.props.view;
  }

  static create(props: EmailProps) {
    const email = new Email(props);
    return email;
  }
}
