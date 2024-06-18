export class ResourceNotFoundError extends Error {
  constructor(resource: string, identifier: string) {
    super(`${resource} ${identifier} não existe.`);
  }
}
