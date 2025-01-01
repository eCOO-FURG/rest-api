export class Document {
  private _value: string

  constructor(value: string) {
    this._value = Document.format(value);
  }

  static format(document: string): string {
    return document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  get value(): string {
    return this._value;
  }
}