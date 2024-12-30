export class Document {
  private _value: string

  constructor(value: string) {
    const numericDocument = value.replace(/\D/g, "");

    if (!Document.isValid(numericDocument)) return;

    this._value = Document.format(numericDocument);
  }

  static isValid(document: string): boolean {
    if (document.length !== 11 || /^(\d)\1+$/.test(document)) {
      return false;
    }
    const digits = document.split("").map(Number);
    const calc = (limit: number) =>
      digits
        .slice(0, limit)
        .reduce((sum, num, idx) => sum + num * (limit + 1 - idx), 0) % 11;
    const dv1 = calc(9) < 2 ? 0 : 11 - calc(9);
    const dv2 = calc(10) < 2 ? 0 : 11 - calc(10);

    return dv1 === digits[9] && dv2 === digits[10];
  }

  static format(document: string): string {
    return document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  get value(): string {
    return this._value;
  }
}