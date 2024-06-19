export class UserAlreadyVerified extends Error {
  constructor(resource: string, identifier: string) {
    super(`${resource} ${identifier} já está verificado.`);
  }
}