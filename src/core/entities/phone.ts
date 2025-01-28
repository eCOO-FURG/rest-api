export class Phone {
  private _value: string;

  constructor(value: string){
    this._value = value;
  }

  format(phone: string): string {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  get value() {
    return this._value;
  }
}