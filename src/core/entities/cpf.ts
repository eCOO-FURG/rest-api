export class CPF {
  private _value: string;

  constructor(value: string) {
    this._value = value;
  }

  format(document: string): string {
    return document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  get value(): string {
    return this._value;
  }

  public equals(cpf: CPF | string) {
    if (typeof cpf === "string") {
      return this.value === cpf;
    }

    return this.value === cpf.value;
  }
}
