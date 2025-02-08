export class Phone {
  private _value: string;

  constructor(value: string) {
    this._value = value;
  }

  get format(): string {
    return this._value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  get value() {
    return this._value;
  }

  public equals(phone: Phone | string) {
    if (typeof phone === "string") {
      return this.value === phone;
    }
  }
}
