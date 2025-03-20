// Entities
import { Farm, FarmProps, OptionalFarmProps } from "@/core/entities/farm";
import { User } from "@/core/entities/user";

// Types
import { Require } from "@/core/types/require";

export interface FarmAndAdminProps extends FarmProps {
  admin: User;
}

export class FarmAndAdmin extends Farm<FarmAndAdminProps> {
  get admin() {
    return this.props.admin;
  }

  static create(props: Require<OptionalFarmProps, "admin">) {
    return new FarmAndAdmin(props);
  }
}
