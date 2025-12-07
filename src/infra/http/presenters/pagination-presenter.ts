// Types
import { View } from "@/infra/types/view";
import { Page } from "@/core/types/page";

export class PaginationPresenter {
  static toHttp<T>(page: Page<T>): View<Page<T>> {
    return {
      data: page.data,
      total: page.total,
      size: page.size,
      page: page.page,
    };
  }
}
