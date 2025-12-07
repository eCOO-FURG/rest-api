import { Page } from "../types/page";

export function paginate<T>(data: T[] = []): Page<T> {
  return {
    total: data.length,
    size: 20,
    page: 1,
    data: data,
  };
}
