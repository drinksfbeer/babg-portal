const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { Schema } = mongoose;

const tokenExpiry = 24 * 60 * 60 * 1000; // in ms; currently 24 hours from token generation
const PwResetTokenSchema = new Schema({
  token: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  expires: { type: Number, default: Date.now() + tokenExpiry },
  completed: { type: Boolean, default: false },
  created: { type: Number, default: Date.now() },
});

PwResetTokenSchema.plugin(uniqueValidator);
const PwResetToken = mongoose.model('pwresettoken', PwResetTokenSchema);

module.exports = PwResetToken;
