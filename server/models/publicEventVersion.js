const mongoose = require('mongoose');

const { Schema } = mongoose;

const PublicEventVersionSchema = new Schema({
  userId: { type: String, required: true },

  // these are arrays of PublicEvent `_id`s
  actives: { type: [String], default: [] },
  approved: { type: [String], default: [] },
  rejected: { type: [String], default: [] },
  pending: { type: [String], default: [] },
  drafts: { type: [String], default: [] },

  // `revisions` is an object where the key is the `_id` of the master PublicEvent
  // (i.e., the first PublicEvent created) and the value is an array of strings,
  // where each element corresponds to an additional revision
  revisions: {
    type: Schema.Types.Mixed,
    default: {},
  },
});

const PublicEventVersion = mongoose.model('publiceventversion', PublicEventVersionSchema);

module.exports = PublicEventVersion;
