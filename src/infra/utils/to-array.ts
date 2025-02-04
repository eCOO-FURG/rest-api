export function toArray<T>(value?: string | string[]) {
  if (!value) return;

  if (Array.isArray(value)) return value as T[];

  return value.split(",") as T[];
}
