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
    const eventIndex = this.events.findIndex(
      (event) => event.entity.id.equals(entity.id)
    );
  
    if (eventIndex < 0) return;

    const event = this.events[eventIndex];
    const handler = this.handlers[event.name];
  
    if (!handler) return;
  
    handler({ entity: event.entity, content: event.payload });
  
    this.events.splice(eventIndex, 1);
  }
}
