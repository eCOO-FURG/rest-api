export class Phone {
  private _value: string;

  constructor(value: string){
    const numericPhone = value.replace(/\D/g, "");

    if (!Phone.isValid(numericPhone)) return;

    this._value = Phone.format(numericPhone);
  }

  static isValid(phone: string): boolean {
    return /^[1-9]{2}9?[0-9]{8}$/.test(phone);
  }

  static format(phone: string): string {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  get value() {
    return this._value;
  }
}