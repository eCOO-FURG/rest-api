export function toBoolean(value?: string) {
  if (!value) return;

  return value === "true";
}
