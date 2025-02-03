// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";

// Types
import { File } from "@/core/types/file";

interface EmailProps extends EntityRequest {
  to: string;
  subject: string;
  content: string;
  files?: File[];
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

  get files() {
    return this.props.files;
  }

  static create(props: EmailProps) {
    const email = new Email(props);
    return email;
  }
}
