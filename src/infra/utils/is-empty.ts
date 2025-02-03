export function isEmpty(value: unknown) {
  if (typeof value === "string") {
    if (value === "No Content") return true;

    return value.trim() === "";
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === "object" && value !== null) {
    return Object.keys(value).length === 0;
  }

  return value === undefined || value === null;
}
