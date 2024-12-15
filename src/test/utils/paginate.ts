export function paginate<T, R extends T[] | Map<string, T>>(
  items: T[] | Map<string, T>,
  page: number,
  size = 20
): R {
  const start = (page - 1) * size;
  const end = start + size;

  if (Array.isArray(items)) {
    return items.slice(start, end) as R;
  }

  return new Map(Array.from(items.entries()).slice(start, end)) as R;
}
