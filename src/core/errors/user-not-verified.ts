export class UserNotVerifiedError extends Error {
  constructor() {
    super(`O usuário não está verificado.`);
  }
}
