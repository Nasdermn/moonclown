export default class GoneError extends Error {
  public statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = 'GoneError';
    this.statusCode = 410;
  }
}
