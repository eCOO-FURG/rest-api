export class WrongCredentialsError extends Error {
  constructor() {
    super(`As credenciais de acesso não são válidas.`);
  }
}
