// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";

interface EmailProps extends EntityRequest {
  to: string;
  subject: string;
  content: string;
  attachments?: {
    filename: string;
    content: Buffer;
    contentType: string
  }[];
}

export class Email extends Entity<EmailProps> {
  get to() {
    return this.props.to;
  }

  get subject() {
    return this.props.subject;
  }

  get content() {
    return this.props.content;
  }

  get attachments() {
    return this.props.attachments;
  }

  static create(props: EmailProps) {
    const email = new Email(props);
    return email;
  }
}
