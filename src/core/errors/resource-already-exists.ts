export class ResourceAlreadyExistsError extends Error {
  constructor() {
    super(`Oferta do produto já existe para esse ciclo.`);
  }
}
