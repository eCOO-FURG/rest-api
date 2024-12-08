export function equals(previous: unknown, current: unknown) {
  const a = JSON.stringify(previous);
  const b = JSON.stringify(current);

  return a === b;
}
