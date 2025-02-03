// Libraries
import { randomUUID } from "crypto";

export class UUID {
  private _value: string;

  constructor(value?: string) {
    this._value = value ?? randomUUID();
  }

  get value() {
    return this._value;
  }

  public equals(id: UUID | string) {
    if (typeof id === "string") {
      return this.value === id;
    }

    return this.value === id.value;
  }
}
