type ToBooleanReturn<T> = T extends string ? boolean : undefined;

export function toBoolean<T extends string>(value?: T): ToBooleanReturn<T> {
  if (!value) {
    return undefined as ToBooleanReturn<T>;
  }

  return Boolean(value === "true") as ToBooleanReturn<T>;
}
