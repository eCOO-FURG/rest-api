export class ClosedActionError extends Error {
  constructor(action: "ofertar" | "enviar" | "comprar", identifier: string) {
    super(`Não é possível ${action} produtos no ciclo ${identifier} hoje.`);
  }
}
