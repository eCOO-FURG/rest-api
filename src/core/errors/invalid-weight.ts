export class InvalidWeightError extends Error {
  constructor(action: "ofertado" | "solicitado", identifier: string) {
    super(`Peso inválido ${action} para o produto ${identifier}.`);
  }
}
