// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";

// Types
import { Optional } from "@/core/types/optional";

export interface MarketProps extends EntityRequest {
  name: string;
  description: string | null;
  open: boolean;
}

export class Market<Props extends MarketProps = MarketProps> extends Entity<Props> {
  get name() {
    return this.props.name;
  }

  get description(): string | null {
    return this.props.description;
  }

  get open() {
    return this.props.open;
  }

  set description(value: string | null) {
    this.props.description = value;
  }

  set open(value: boolean) {
    this.props.open = value;
  }

  set name(value: string) {
    this.props.name = value;
  }

  static create(props: Optional<MarketProps, "open" | "description">) {
    return new Market({
      ...props,
      open: props.open ?? true,
      description: props.description ?? null,
    });
  }
}
