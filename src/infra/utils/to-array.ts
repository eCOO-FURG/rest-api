export function toArray<T>(value?: string) {
  if (!value) return;

  return value.split(",") as T[];
}
