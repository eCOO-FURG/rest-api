export function toJSON(schema: unknown) {
  return JSON.parse(JSON.stringify(schema));
}
