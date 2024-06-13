export class EmptyPasswordError extends Error {
  constructor() {
    super("Essa conta não tem uma senha definida.");
  }
}
