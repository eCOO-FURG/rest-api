export class ResourceAlreadyExistsError extends Error {
  constructor(resource: string, identifier: string) {
    super(`${resource} ${identifier} já existe.`);
  }
}
