const MONGO_DUPLICATE_KEY_ERROR = 11000;
const SALT_ROUNDS = 10;
// eslint-disable-next-line no-useless-escape
const urlRegex = /^https?:\/\/(www\.)?[0-9a-zA-Z]+([.|-]{1}[0-9a-zA-Z]+)*\.[0-9a-zA-Z-]+(\/[0-9a-zA-Z\-._~:/?#\[\]@!$&'()*+,;=]*#?)?$/;

module.exports = {
  MONGO_DUPLICATE_KEY_ERROR,
  SALT_ROUNDS,
  urlRegex,
};
