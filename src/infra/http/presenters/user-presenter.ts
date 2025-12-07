// Entities
import { User, UserProps } from "@/core/entities/user";

// Types
import { View } from "@/infra/types/view";

export class UserPresenter {
  static toHttp(user?: User | null): View<UserProps> | null {
    if (user === null) {
      return null;
    }

    if (user) {
      return {
        id: user.id.value,
        first_name: user.first_name,
        last_name: user.last_name,
        photo: user.photo,
        cpf: user.cpf.format,
        email: user.email,
        active: user.active,
        phone: user.phone.format,
        chat: user.chat,
        admin: user.admin,
        roles: user.roles,
        verified_at: user.verified_at,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };
    }
  }
}
