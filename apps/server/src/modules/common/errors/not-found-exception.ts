export class NotFoundException extends Error {
  constructor() {
    super("Recurso não encontrado.");
    this.name = "NotFoundException";
  }
} 