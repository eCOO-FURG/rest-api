export function toNullable(value?: string) {
  if (value === "null") {
    return null;
  }

  return value;
}
