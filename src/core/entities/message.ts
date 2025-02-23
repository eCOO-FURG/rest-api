// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";

// Types
import { File } from "@/core/types/file";
import { Optional } from "@/core/types/optional";

export interface MessageProps extends EntityRequest {
  to: string;
  subject: string;
  content: string;
  files: File[];
}

export class Message extends Entity<MessageProps> {
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

  static create(props: Optional<MessageProps, "files">) {
    const message = new Message({
      ...props,
      files: props.files ?? [],
    });
    return message;
  }
}
