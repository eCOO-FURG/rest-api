// Entities
import { Farm, FarmProps } from "@/core/entities/farm";
import { User } from "@/core/entities/user";

export interface FarmAndAdminProps extends FarmProps {
  admin: User;
}

export class FarmAndAdmin extends Farm<FarmAndAdminProps> {
  get admin() {
    return this.props.admin;
  }

  static create(props: FarmAndAdminProps) {
    return new FarmAndAdmin(props);
  }
}
