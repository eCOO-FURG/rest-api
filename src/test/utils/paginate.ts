export function paginate<T extends unknown[]>(
  items: T,
  page: number,
  size = 20
): T {
  const start = (page - 1) * size;
  const end = start + size;

  return items.slice(start, end) as T;
}
