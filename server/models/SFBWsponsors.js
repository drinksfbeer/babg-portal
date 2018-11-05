const mongoose = require('mongoose');

const { Schema } = mongoose;

const SFBWSponsorSchema = new Schema({
  name: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  description: {
    type: String,
  },
  website: {
    type: String,
  },
  level: {
    type: String,
  },
});

const SFBWSponsor = mongoose.model('SFBWsponsor', SFBWSponsorSchema);

module.exports = SFBWSponsor;
