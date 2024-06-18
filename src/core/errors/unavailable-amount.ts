export class UnavailableAmountError extends Error {
  constructor(identifier: string) {
    super(`Quantidade indisponível da oferta ${identifier}`);
  }
}
