export class FarmNotActiveError extends Error {
  constructor() {
    super(`O agronegócio não está ativo.`);
  }
}
