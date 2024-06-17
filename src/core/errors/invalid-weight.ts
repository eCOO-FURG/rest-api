export class InvalidWeightError extends Error {
  constructor(action: "Ofertado" | "Solicitado", identifier: string) {
    super(`Peso inválido ${action} para o produto ${identifier}.`);
  }
}
