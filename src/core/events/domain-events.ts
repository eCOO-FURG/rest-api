// Entities
import { Entity } from "@/core/entities/entity";

// Events
import { DomainEvent } from "@/core/events/domain-event";

type Callback = (props: any) => void;

export class DomainEvents {
  public static events: DomainEvent[] = [];
  static handlers: Record<string, Callback> = {};

  static register(name: string, callback: Callback) {
    const alreadyExists = name in this.handlers;

    if (alreadyExists) return;

    this.handlers[name] = callback;
  }

  static dispatch(entity: Entity<unknown>) {
    const event = this.events.findIndex((event) =>
      event.entity.id.equals(entity.id)
    );

    if (event < 0) return;

    const handler = this.handlers[this.events[event].name];

    if (!handler) return;

    const props = {
      ...this.events[event].entity.props,
      ...this.events[event].payload,
    };

    handler(props);

    this.events.splice(event, 1);
  }
}
