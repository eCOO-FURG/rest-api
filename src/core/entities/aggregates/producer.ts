// Entities
import { Farm, FarmProps } from "@/core/entities/farm";
import { User } from "@/core/entities/user";

// Types
import { Optional } from "@/core/types/optional";

export interface ProducerProps extends FarmProps {
  admin: User;
}

export type OptionalProducerProps = Optional<
  ProducerProps,
  "offers" | "status" | "fee" | "description" | "photo" | "images" | "offers"
>;

export class Producer extends Farm<ProducerProps> {
  get admin() {
    return this.props.admin;
  }

  static create(props: OptionalProducerProps) {
    return new Producer({
      ...props,
      status: props.status ?? "PENDING",
      fee: props.fee ?? 20,
      description: props.description ?? null,
      photo: props.photo ?? null,
      images: props.images ?? [],
      offers: props.offers ?? [],
    });
  }
}
