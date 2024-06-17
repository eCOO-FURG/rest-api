// Entities
import { Entity } from "@/core/entities/entity";

export interface DomainEvent {
  name: string;
  entity: Entity<unknown>;
}
