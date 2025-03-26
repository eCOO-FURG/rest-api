// Entities
import { Farm, FarmProps } from "@/core/entities/farm";

// Presenters
import { UserPresenter } from "@/infra/http/presenters/user-presenter";

// Types
import { View } from "@/infra/types/view";

export class FarmPresenter {
  static toHttp(farm?: Farm): View<FarmProps> {
    const admin = UserPresenter.toHttp(farm?.admin);

    if (admin) {
      delete admin.roles;
      delete admin.verified_at;
    }

    if (farm)
      return {
        id: farm.id.value,
        name: farm.name,
        status: farm.status,
        tally: farm.tally,
        fee: farm.fee,
        photo: farm.photo,
        images: farm.images,
        description: farm.description,
        admin_id: farm.admin_id.value,
        admin: admin,
        created_at: farm.created_at,
        updated_at: farm.updated_at,
      };
  }
}
