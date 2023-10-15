module.exports = class GoneError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 410;
  }
};
