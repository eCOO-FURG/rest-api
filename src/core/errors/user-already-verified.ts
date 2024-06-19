export class UserAlreadyVerified extends Error {
  constructor(identifier: string) {
    super(`Usuário ${identifier} já está verificado.`);
  }
}