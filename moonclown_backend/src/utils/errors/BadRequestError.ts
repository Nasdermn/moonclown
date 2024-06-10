export default class BadRequestError extends Error {
  public statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = 400;
  }
}
