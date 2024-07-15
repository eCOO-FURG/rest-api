export class InvalidVolumeError extends Error {
  constructor(action: "ofertado" | "solicitado", identifier: string) {
    super(`Volume inválido ${action} para o produto ${identifier}.`);
  }
}
