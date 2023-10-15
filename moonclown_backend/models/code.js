const mongoose = require('mongoose');
const { isEmail } = require('validator');

const codeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: [isEmail],
  },

  code: {
    type: String,
    required: true,
    select: false,
  },

  createdAt: {
    type: Date,
    expires: 300, // TTL set to 5 minutes (300 seconds)
    default: Date.now,
  },
});

module.exports = mongoose.model('code', codeSchema);
