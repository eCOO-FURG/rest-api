// Entities
import { Farm, FarmProps } from "@/core/entities/farm";
import { User } from "@/core/entities/user";

// Types
import { Optional } from "@/core/types/optional";

export interface FarmAndAdminProps extends FarmProps {
  admin: User;
}

export class FarmAndAdmin extends Farm<FarmAndAdminProps> {
  get admin() {
    return this.props.admin;
  }

  static create(props: Optional<FarmAndAdminProps, "offers">) {
    return new FarmAndAdmin({
      ...props,
      offers: props.offers ?? [],
    });
  }
}
