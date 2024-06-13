export class ResourceNotFoundError extends Error {
  constructor(name: string, key: string) {
    super(`${name} ${key} não existe.`);
  }
}
