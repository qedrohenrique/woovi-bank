export class UnauthorizedException extends Error {
  constructor() {
    super("Acesso não autorizado.");
    this.name = "UnauthorizedException";
  }
}